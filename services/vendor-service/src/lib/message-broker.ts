import amqp, { Channel, ChannelModel } from 'amqplib';
import { config } from '../config/index.js';
import { createServiceLogger } from '@freeshop/shared-utils';

const logger = createServiceLogger('vendor-service');

class MessageBroker {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private isConnected = false;

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(config.rabbitmq.url);
      this.channel = await this.connection.createChannel();
      
      this.connection.on('error', (err) => {
        this.isConnected = false;
        logger.error('RabbitMQ connection error', { error: err.message });
      });

      this.connection.on('close', () => {
        this.isConnected = false;
        logger.warn('RabbitMQ connection closed');
      });

      this.isConnected = true;

      logger.info('Connected to RabbitMQ');
    } catch (error) {
      logger.error('Failed to connect to RabbitMQ', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  async publish(exchange: string, routingKey: string, message: unknown): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not initialized');
    }

    await this.channel.assertExchange(exchange, 'topic', { durable: true });

    this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true }
    );

    logger.debug('Message published', { exchange, routingKey });
  }

  async subscribe<T>(
    exchange: string,
    queue: string,
    routingKey: string,
    handler: (message: T) => Promise<void>
  ): Promise<void> {
    if (!this.channel) {
      throw new Error('Channel not initialized');
    }

    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    
    const deadLetterExchange = `${exchange}.dlx`;
    await this.channel.assertExchange(deadLetterExchange, 'topic', { durable: true });
    
    await this.channel.assertQueue(queue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': deadLetterExchange,
        'x-dead-letter-routing-key': `${routingKey}.dead`,
      },
    });
    
    await this.channel.bindQueue(queue, exchange, routingKey);

    this.channel.consume(queue, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString()) as T;
          await handler(content);
          this.channel!.ack(msg);
        } catch (error) {
          logger.error('Error processing message', {
            error: error instanceof Error ? error.message : 'Unknown error',
            queue,
          });
          this.channel!.nack(msg, false, false);
        }
      }
    });

    logger.info('Subscribed to queue', { queue, routingKey });
  }

  async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    this.isConnected = false;
  }

  isConnectedToBroker(): boolean {
    return this.isConnected;
  }
}

export const messageBroker = new MessageBroker();
