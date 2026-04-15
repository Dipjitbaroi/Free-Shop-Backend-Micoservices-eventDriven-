import { prisma } from '../lib/prisma';
import { redis, CACHE_TTL } from '../lib/redis';
import { messageBroker } from '../lib/message-broker';
import { emailProvider } from '../providers/email.provider';
import { smsProvider } from '../providers/sms.provider';
import { EXCHANGES, getRoutingKey } from '@freeshop/shared-events';
import { NotificationType, NotificationChannel, NotificationStatus, Prisma } from '../../generated/prisma';
import Handlebars from 'handlebars';
import logger, { NotFoundError, BadRequestError } from '@freeshop/shared-utils';

interface SendNotificationInput {
  userId?: string;
  email?: string;
  phone?: string;
  type: NotificationType;
  channel: NotificationChannel;
  templateId?: string;
  templateData?: Record<string, unknown>;
  subject?: string;
  content?: string;
  metadata?: Record<string, unknown>;
}

interface NotificationFilters {
  userId?: string;
  type?: NotificationType;
  channel?: NotificationChannel;
  status?: NotificationStatus;
  page?: number;
  limit?: number;
}

class NotificationService {
  async sendNotification(input: SendNotificationInput) {
    const preference = input.userId 
      ? await this.getUserPreference(input.userId)
      : null;

    if (preference && !this.isNotificationEnabled(preference, input.type, input.channel)) {
      logger.info('Notification skipped - user preference disabled', {
        userId: input.userId,
        type: input.type,
        channel: input.channel,
      });
      return null;
    }

    let subject = input.subject || '';
    let content = input.content || '';

    if (input.templateId) {
      const template = await this.getTemplate(input.templateId);
      if (template) {
        const compiledSubject = template.subject 
          ? Handlebars.compile(template.subject)
          : null;
        const compiledBody = Handlebars.compile(template.body);

        if (compiledSubject) {
          subject = compiledSubject(input.templateData || {});
        }
        content = compiledBody(input.templateData || {});
      }
    }

    const notification = await prisma.notification.create({
      data: {
        userId: input.userId,
        email: input.email,
        phone: input.phone,
        type: input.type,
        channel: input.channel,
        subject,
        content,
        templateId: input.templateId,
        templateData: input.templateData as Prisma.InputJsonValue,
        metadata: input.metadata as Prisma.InputJsonValue,
        status: 'QUEUED',
      },
    });

    try {
      await this.processNotification(notification.id);
    } catch (error) {
      logger.error('Error processing notification', {
        notificationId: notification.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    return notification;
  }

  async processNotification(notificationId: string) {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.status === 'SENT' || notification.status === 'CANCELLED') {
      return;
    }

    try {
      switch (notification.channel) {
        case 'EMAIL':
          if (notification.email) {
            await emailProvider.sendEmail({
              to: notification.email,
              subject: notification.subject || '',
              html: notification.content,
            });
          }
          break;

        case 'SMS':
          if (notification.phone) {
            await smsProvider.sendSms({
              to: notification.phone,
              body: notification.content,
            });
          }
          break;

        case 'PUSH':
          await this.sendPushNotification(notification);
          break;

        case 'IN_APP':
          break;
      }

      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      await messageBroker.publish(
        EXCHANGES.NOTIFICATION,
        getRoutingKey('NOTIFICATION', 'SENT'),
        {
          notificationId,
          userId: notification.userId,
          type: notification.type,
          channel: notification.channel,
        }
      );

      logger.info('Notification sent', {
        notificationId,
        channel: notification.channel,
        type: notification.type,
      });
    } catch (error) {
      const retryCount = notification.retryCount + 1;
      const shouldRetry = retryCount < notification.maxRetries;

      await prisma.notification.update({
        where: { id: notificationId },
        data: {
          status: shouldRetry ? 'PENDING' : 'FAILED',
          failedAt: shouldRetry ? null : new Date(),
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          retryCount,
        },
      });

      if (!shouldRetry) {
        await messageBroker.publish(
          EXCHANGES.NOTIFICATION,
          getRoutingKey('NOTIFICATION', 'FAILED'),
          {
            notificationId,
            userId: notification.userId,
            type: notification.type,
            channel: notification.channel,
            error: error instanceof Error ? error.message : 'Unknown error',
          }
        );
      }

      throw error;
    }
  }

  private async sendPushNotification(notification: { userId?: string | null, subject?: string | null, content: string }) {
    if (!notification.userId) return;

    const devices = await prisma.deviceToken.findMany({
      where: { userId: notification.userId, isActive: true },
    });

    if (devices.length === 0) {
      logger.info('No active devices for push notification', { userId: notification.userId });
      return;
    }

    logger.info('Push notification queued', {
      userId: notification.userId,
      deviceCount: devices.length,
    });
  }

  async sendBulkNotification(
    userIds: string[],
    type: NotificationType,
    channel: NotificationChannel,
    templateId: string,
    templateData: Record<string, unknown>
  ) {
    const results = await Promise.allSettled(
      userIds.map((userId) =>
        this.sendNotification({
          userId,
          type,
          channel,
          templateId,
          templateData,
        })
      )
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    logger.info('Bulk notification sent', {
      total: userIds.length,
      successful,
      failed,
    });

    return { total: userIds.length, successful, failed };
  }

  async getNotifications(filters: NotificationFilters) {
    const { userId, type, channel, status, page = 1, limit = 20 } = filters;

    const where: Prisma.NotificationWhereInput = {};
    if (userId) where.userId = userId;
    if (type) where.type = type;
    if (channel) where.channel = channel;
    if (status) where.status = status;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getNotificationById(id: string) {
    return prisma.notification.findUnique({ where: { id } });
  }

  async cancelNotification(id: string) {
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    if (notification.status === 'SENT' || notification.status === 'DELIVERED') {
      throw new BadRequestError('Cannot cancel a sent notification');
    }

    return prisma.notification.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async createTemplate(data: {
    name: string;
    description?: string;
    type: NotificationType;
    channel: NotificationChannel;
    subject?: string;
    body: string;
    variables?: string[];
  }) {
    const template = await prisma.notificationTemplate.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        channel: data.channel,
        subject: data.subject,
        body: data.body,
        variables: data.variables || [],
      },
    });

    await redis.del(`template:${data.name}`);

    return template;
  }

  async updateTemplate(id: string, data: Partial<{
    name: string;
    description: string;
    subject: string;
    body: string;
    variables: string[];
    isActive: boolean;
  }>) {
    const existing = await prisma.notificationTemplate.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('Template not found');
    }

    const template = await prisma.notificationTemplate.update({
      where: { id },
      data,
    });

    await redis.del(`template:${existing.name}`);
    if (data.name) {
      await redis.del(`template:${data.name}`);
    }

    return template;
  }

  async getTemplate(nameOrId: string) {
    const cacheKey = `template:${nameOrId}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    let template = await prisma.notificationTemplate.findUnique({
      where: { name: nameOrId },
    });

    if (!template) {
      template = await prisma.notificationTemplate.findUnique({
        where: { id: nameOrId },
      });
    }

    if (template) {
      await redis.setex(cacheKey, CACHE_TTL.TEMPLATE, JSON.stringify(template));
    }

    return template;
  }

  async listTemplates(filters: {
    type?: NotificationType;
    channel?: NotificationChannel;
    isActive?: boolean;
  }) {
    const where: Prisma.NotificationTemplateWhereInput = {};
    if (filters.type) where.type = filters.type;
    if (filters.channel) where.channel = filters.channel;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;

    return prisma.notificationTemplate.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async getUserPreference(userId: string) {
    const cacheKey = `pref:${userId}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    let preference = await prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!preference) {
      preference = await prisma.notificationPreference.create({
        data: { userId },
      });
    }

    await redis.setex(cacheKey, CACHE_TTL.PREFERENCE, JSON.stringify(preference));

    return preference;
  }

  async updateUserPreference(userId: string, data: Partial<{
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    VendorUpdates: boolean;
    accountUpdates: boolean;
    priceAlerts: boolean;
  }>) {
    const preference = await prisma.notificationPreference.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });

    await redis.del(`pref:${userId}`);

    return preference;
  }

  async registerDevice(userId: string, data: {
    token: string;
    platform: 'IOS' | 'ANDROID' | 'WEB';
    deviceInfo?: Record<string, unknown>;
  }) {
    return prisma.deviceToken.upsert({
      where: { token: data.token },
      create: {
        userId,
        token: data.token,
        platform: data.platform,
        deviceInfo: data.deviceInfo as Prisma.InputJsonValue,
      },
      update: {
        userId,
        isActive: true,
        lastUsedAt: new Date(),
        deviceInfo: data.deviceInfo as Prisma.InputJsonValue,
      },
    });
  }

  async unregisterDevice(token: string) {
    return prisma.deviceToken.update({
      where: { token },
      data: { isActive: false },
    });
  }

  private isNotificationEnabled(
    preference: {
      emailEnabled: boolean;
      smsEnabled: boolean;
      pushEnabled: boolean;
      orderUpdates: boolean;
      promotions: boolean;
      vendorUpdates: boolean;
      accountUpdates: boolean;
      priceAlerts: boolean;
    },
    type: NotificationType,
    channel: NotificationChannel
  ): boolean {
    if (channel === 'EMAIL' && !preference.emailEnabled) return false;
    if (channel === 'SMS' && !preference.smsEnabled) return false;
    if (channel === 'PUSH' && !preference.pushEnabled) return false;

    const orderTypes: NotificationType[] = [
      'ORDER_CREATED', 'ORDER_CONFIRMED', 'ORDER_SHIPPED', 
      'ORDER_DELIVERED', 'ORDER_CANCELLED'
    ];
    if (orderTypes.includes(type) && !preference.orderUpdates) return false;

    if (type === 'PROMOTION' && !preference.promotions) return false;

    const vendorTypes: NotificationType[] = [
      'VENDOR_VERIFIED', 'VENDOR_SUSPENDED', 
      'WITHDRAWAL_COMPLETED', 'WITHDRAWAL_REJECTED'
    ];
    if (vendorTypes.includes(type) && !preference.vendorUpdates) return false;

    const accountTypes: NotificationType[] = [
      'WELCOME', 'PASSWORD_RESET', 'EMAIL_VERIFICATION'
    ];
    if (accountTypes.includes(type) && !preference.accountUpdates) return false;

    const priceTypes: NotificationType[] = [
      'PRICE_DROP', 'BACK_IN_STOCK', 'LOW_STOCK_ALERT'
    ];
    if (priceTypes.includes(type) && !preference.priceAlerts) return false;

    return true;
  }
}

export const notificationService = new NotificationService();

