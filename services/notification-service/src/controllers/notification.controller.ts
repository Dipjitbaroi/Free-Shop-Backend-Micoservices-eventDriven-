import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service';
import { successResponse, UnauthorizedError, NotFoundError } from '@freeshop/shared-utils';

export const notificationController = {
  async sendNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await notificationService.sendNotification({
        userId: req.body.userId,
        email: req.body.email,
        phone: req.body.phone,
        type: req.body.type,
        channel: req.body.channel,
        templateId: req.body.templateId,
        templateData: req.body.templateData,
        subject: req.body.subject,
        content: req.body.content,
        metadata: req.body.metadata,
      });

      res.status(201).json(successResponse(notification, 'Notification sent'));
    } catch (error) {
      next(error);
    }
  },

  async sendBulkNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notificationService.sendBulkNotification(
        req.body.userIds,
        req.body.type,
        req.body.channel,
        req.body.templateId,
        req.body.templateData
      );

      res.status(201).json(successResponse(result, 'Bulk notification sent'));
    } catch (error) {
      next(error);
    }
  },

  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await notificationService.getNotifications({
        userId: req.query.userId as string,
        type: req.query.type as any,
        channel: req.query.channel as any,
        status: req.query.status as any,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      res.json(successResponse(result, 'Notifications retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async getMyNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('User not authenticated');

      const result = await notificationService.getNotifications({
        userId,
        type: req.query.type as any,
        channel: req.query.channel as any,
        status: req.query.status as any,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      });

      res.json(successResponse(result, 'Notifications retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async getNotificationById(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await notificationService.getNotificationById(req.params.id as string);
      if (!notification) throw new NotFoundError('Notification not found');

      res.json(successResponse(notification, 'Notification retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async cancelNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await notificationService.cancelNotification(req.params.id as string);
      res.json(successResponse(notification, 'Notification cancelled'));
    } catch (error) {
      next(error);
    }
  },

  async getMyPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('User not authenticated');

      const preference = await notificationService.getUserPreference(userId);
      res.json(successResponse(preference, 'Preferences retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async updateMyPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('User not authenticated');

      const preference = await notificationService.updateUserPreference(userId, req.body);
      res.json(successResponse(preference, 'Preferences updated'));
    } catch (error) {
      next(error);
    }
  },

  async registerDevice(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) throw new UnauthorizedError('User not authenticated');

      const device = await notificationService.registerDevice(userId, {
        token: req.body.token,
        platform: req.body.platform,
        deviceInfo: req.body.deviceInfo,
      });

      res.status(201).json(successResponse(device, 'Device registered'));
    } catch (error) {
      next(error);
    }
  },

  async unregisterDevice(req: Request, res: Response, next: NextFunction) {
    try {
      await notificationService.unregisterDevice(req.params.token as string);
      res.json(successResponse(null, 'Device unregistered successfully'));
    } catch (error) {
      next(error);
    }
  },
};
