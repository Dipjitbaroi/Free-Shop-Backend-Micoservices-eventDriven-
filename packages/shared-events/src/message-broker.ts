import amqp, { Channel, ConsumeMessage, ChannelModel, Options } from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
import { IBaseEvent } from './event-types';
import { EventName, ExchangeName, Exchanges, Queues } from './constants';

export interface IMessageBrokerConfig {
  url: string;
  serviceName: string;
  prefetch?: number;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
}

export interface IPublishOptions {
  persistent?: boolean;
  priority?: number;
  expiration?: string;
  correlationId?: string;
  headers?: Record<string, unknown>;
}

export interface IConsumeOptions {
  noAck?: boolean;
  prefetch?: number;
  deadLetterExchange?: string;
  deadLetterRoutingKey?: string;
  messageTtl?: number;
  maxRetries?: number;
}

export type MessageHandler<T = unknown> = (
  data: T,
  originalMessage: ConsumeMessage
) => Promise<void>;

interface IPendingMessage {
  exchange: ExchangeName;
  routingKey: string;
  data: unknown;
  options: IPublishOptions;
}

export class MessageBroker {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private config: IMessageBrokerConfig;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private handlers: Map<string, MessageHandler[]> = new Map();
  /** Messages buffered while the broker is reconnecting */
  private outbox: IPendingMessage[] = [];

  constructor(config: IMessageBrokerConfig) {
    this.config = {
      prefetch: 10,
      reconnectDelay: 5000,
      maxReconnectAttempts: 10,
      ...config,
    };
  }

  async connect(): Promise<void> {
    try {
      const conn = await amqp.connect(this.config.url);
      this.connection = conn;
      this.channel = await conn.createChannel();
      
      await this.channel.prefetch(this.config.prefetch!);
      
      // Set up exchange and queue declarations
      await this.setupExchanges();
      
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      console.log(`[${this.config.serviceName}] Connected to RabbitMQ`);

      // Drain any messages that were buffered while disconnected
      await this.flushOutbox();

      // Handle connection errors
      conn.on('error', (err) => {
        console.error(`[${this.config.serviceName}] RabbitMQ connection error:`, err);
        this.handleDisconnect();
      });

      conn.on('close', () => {
        console.warn(`[${this.config.serviceName}] RabbitMQ connection closed`);
        this.handleDisconnect();
      });

    } catch (error) {
      console.error(`[${this.config.serviceName}] Failed to connect to RabbitMQ:`, error);
      await this.handleDisconnect();
    }
  }

  private async setupExchanges(): Promise<void> {
    if (!this.channel) throw new Error('Channel not initialized');

    // Declare all non-dead-letter exchanges as topic exchanges
    for (const exchange of Object.values(Exchanges)) {
      if (exchange === Exchanges.DEAD_LETTER) continue;
      await this.channel.assertExchange(exchange, 'topic', {
        durable: true,
        autoDelete: false,
      });
    }

    // Set up dead letter exchange
    await this.channel.assertExchange(Exchanges.DEAD_LETTER, 'direct', {
      durable: true,
    });

    // Set up dead letter queue
    await this.channel.assertQueue(Queues.DEAD_LETTER, {
      durable: true,
    });

    await this.channel.bindQueue(
      Queues.DEAD_LETTER,
      Exchanges.DEAD_LETTER,
      'dead_letter'
    );
  }

  private async flushOutbox(): Promise<void> {
    if (this.outbox.length === 0) return;
    const pending = this.outbox.splice(0);
    console.log(`[${this.config.serviceName}] Flushing ${pending.length} buffered message(s)`);
    for (const msg of pending) {
      try {
        await this.publish(msg.exchange, msg.routingKey, msg.data, msg.options);
      } catch (err) {
        console.error(`[${this.config.serviceName}] Failed to flush buffered message:`, err);
      }
    }
  }

  private async handleDisconnect(): Promise<void> {
    this.isConnected = false;
    this.channel = null;
    this.connection = null;

    if (this.reconnectAttempts < this.config.maxReconnectAttempts!) {
      this.reconnectAttempts++;
      console.log(
        `[${this.config.serviceName}] Attempting to reconnect (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})...`
      );
      
      await new Promise((resolve) => 
        setTimeout(resolve, this.config.reconnectDelay)
      );
      
      await this.connect();
    } else {
      console.error(
        `[${this.config.serviceName}] Max reconnection attempts reached. Giving up.`
      );
      process.exit(1);
    }
  }

  async publish<T>(
    exchange: ExchangeName,
    routingKey: EventName | string,
    data: T,
    options: IPublishOptions = {}
  ): Promise<boolean> {
    if (!this.channel || !this.isConnected) {
      // Buffer the message — it will be sent once the broker reconnects
      this.outbox.push({ exchange, routingKey, data, options });
      console.warn(
        `[${this.config.serviceName}] Broker not ready — buffered message for exchange "${exchange}" (outbox size: ${this.outbox.length})`
      );
      return false;
    }

    const event: IBaseEvent<T> = {
      id: uuidv4(),
      type: routingKey as EventName,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      source: this.config.serviceName,
      correlationId: options.correlationId || uuidv4(),
      data,
    };

    const messageBuffer = Buffer.from(JSON.stringify(event));

    const publishOptions: Options.Publish = {
      persistent: options.persistent ?? true,
      contentType: 'application/json',
      timestamp: Date.now(),
      messageId: event.id,
      correlationId: event.correlationId,
      appId: this.config.serviceName,
      priority: options.priority,
      expiration: options.expiration,
      headers: options.headers,
    };

    return this.channel.publish(
      exchange,
      routingKey,
      messageBuffer,
      publishOptions
    );
  }

  // Overload: (queue, routingKey, handler)
  subscribe<T>(queue: string, routingKey: string, handler: MessageHandler<T>): Promise<void>;
  // Overload: (exchange, queue, routingKey, handler, options?)
  subscribe<T>(exchangeOrQueue: string, queueOrExchange: string, routingKeyOrKeys: string | string[], handler: MessageHandler<T>, options?: IConsumeOptions): Promise<void>;
  async subscribe<T>(...args: unknown[]): Promise<void> {
    let queue: string;
    let exchange: string;
    let routingKeys: string[];
    let handler: MessageHandler<T>;
    let options: IConsumeOptions = {};

    if (typeof args[2] === 'function') {
      // Pattern: (queue, routingKey, handler)
      queue = args[0] as string;
      const routingKey = args[1] as string;
      routingKeys = [routingKey];
      handler = args[2] as MessageHandler<T>;
      // Derive exchange from routing key (e.g., 'user.created' -> 'freeshop.user')
      const entity = routingKey.split('.')[0];
      exchange = `freeshop.${entity}`;
    } else if (typeof args[3] === 'function') {
      handler = args[3] as MessageHandler<T>;
      options = (args[4] as IConsumeOptions) || {};
      if (Array.isArray(args[2])) {
        // Pattern: (queue, exchange, routingKeys[], handler, options?)
        queue = args[0] as string;
        exchange = args[1] as string;
        routingKeys = args[2] as string[];
      } else {
        // Pattern: (exchange, queue, routingKey, handler, options?)
        exchange = args[0] as string;
        queue = args[1] as string;
        routingKeys = [args[2] as string];
      }
    } else {
      throw new Error('Invalid subscribe arguments');
    }

    if (!this.channel || !this.isConnected) {
      throw new Error('Not connected to RabbitMQ');
    }

    // Assert queue
    const queueOptions: Options.AssertQueue = {
      durable: true,
      autoDelete: false,
      arguments: {
        'x-dead-letter-exchange': options.deadLetterExchange || Exchanges.DEAD_LETTER,
        'x-dead-letter-routing-key': options.deadLetterRoutingKey || 'dead_letter',
      },
    };

    if (options.messageTtl) {
      queueOptions.arguments!['x-message-ttl'] = options.messageTtl;
    }

    await this.channel.assertQueue(queue, queueOptions);

    // Bind queue to exchange with routing keys
    for (const routingKey of routingKeys) {
      await this.channel.bindQueue(queue, exchange, routingKey);
    }

    // Set prefetch if specified
    if (options.prefetch) {
      await this.channel.prefetch(options.prefetch);
    }

    // Store handler
    const handlerKey = `${exchange}:${queue}`;
    if (!this.handlers.has(handlerKey)) {
      this.handlers.set(handlerKey, []);
    }
    this.handlers.get(handlerKey)!.push(handler as MessageHandler);

    // Consume messages
    await this.channel.consume(
      queue,
      async (message) => {
        if (!message) return;

        try {
          const event: IBaseEvent<T> = JSON.parse(message.content.toString());
          
          // Pass the data payload directly to the handler
          await handler(event.data, message);
          
          if (!options.noAck) {
            this.channel?.ack(message);
          }
        } catch (error) {
          console.error(
            `[${this.config.serviceName}] Error processing message:`,
            error
          );

          // Check retry count
          const retryCount = (message.properties.headers?.['x-retry-count'] as number) || 0;
          const maxRetries = options.maxRetries ?? 3;

          if (retryCount < maxRetries) {
            // Reject and requeue with incremented retry count
            if (!options.noAck) {
              this.channel?.nack(message, false, false);
              
              // Republish with retry count
              await this.republishWithRetry(message, retryCount + 1);
            }
          } else {
            // Max retries reached, send to dead letter queue
            if (!options.noAck) {
              this.channel?.nack(message, false, false);
            }
          }
        }
      },
      { noAck: options.noAck ?? false }
    );

    console.log(
      `[${this.config.serviceName}] Subscribed to ${queue} for events: ${routingKeys.join(', ')}`
    );
  }

  private async republishWithRetry(
    originalMessage: ConsumeMessage,
    retryCount: number
  ): Promise<void> {
    if (!this.channel) return;

    const exchange = originalMessage.fields.exchange;
    const routingKey = originalMessage.fields.routingKey;

    // Add delay before retry (exponential backoff)
    const delay = Math.min(1000 * Math.pow(2, retryCount), 60000);
    
    await new Promise((resolve) => setTimeout(resolve, delay));

    const headers = {
      ...originalMessage.properties.headers,
      'x-retry-count': retryCount,
      'x-original-exchange': exchange,
      'x-original-routing-key': routingKey,
    };

    this.channel.publish(exchange, routingKey, originalMessage.content, {
      ...originalMessage.properties,
      headers,
    });
  }

  async createRpcClient(
    queue: string,
    timeout: number = 30000
  ): Promise<(message: unknown) => Promise<unknown>> {
    if (!this.channel) throw new Error('Channel not initialized');

    const replyQueue = await this.channel.assertQueue('', {
      exclusive: true,
      autoDelete: true,
    });

    const pendingRequests = new Map<
      string,
      { resolve: (value: unknown) => void; reject: (error: Error) => void }
    >();

    await this.channel.consume(
      replyQueue.queue,
      (message) => {
        if (!message) return;

        const correlationId = message.properties.correlationId;
        const pending = pendingRequests.get(correlationId);

        if (pending) {
          const response = JSON.parse(message.content.toString());
          pending.resolve(response);
          pendingRequests.delete(correlationId);
        }

        this.channel?.ack(message);
      },
      { noAck: false }
    );

    return async (message: unknown): Promise<unknown> => {
      const correlationId = uuidv4();

      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          pendingRequests.delete(correlationId);
          reject(new Error('RPC request timeout'));
        }, timeout);

        pendingRequests.set(correlationId, {
          resolve: (value) => {
            clearTimeout(timer);
            resolve(value);
          },
          reject: (error) => {
            clearTimeout(timer);
            reject(error);
          },
        });

        this.channel!.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
          correlationId,
          replyTo: replyQueue.queue,
          contentType: 'application/json',
        });
      });
    };
  }

  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.isConnected = false;
      console.log(`[${this.config.serviceName}] Disconnected from RabbitMQ`);
    } catch (error) {
      console.error(`[${this.config.serviceName}] Error closing connection:`, error);
    }
  }

  getChannel(): Channel | null {
    return this.channel;
  }

  isConnectedToBroker(): boolean {
    return this.isConnected;
  }
}

// Factory function
export const createMessageBroker = (config: IMessageBrokerConfig): MessageBroker => {
  return new MessageBroker(config);
};
