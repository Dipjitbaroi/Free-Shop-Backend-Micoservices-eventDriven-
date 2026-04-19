import { createMessageBroker, createEventPublisher } from '@freeshop/shared-events';
import config from '../config/index.js';

export const messageBroker = createMessageBroker({
  url: config.rabbitmq.url,
  serviceName: 'order-service',
});

export const eventPublisher = createEventPublisher(messageBroker);
