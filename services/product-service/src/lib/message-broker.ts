import { createMessageBroker, createEventPublisher } from '@freeshop/shared-events';
import config from '../config';

export const messageBroker = createMessageBroker({
  url: config.rabbitmq.url,
  serviceName: 'product-service',
});

export const eventPublisher = createEventPublisher(messageBroker);
