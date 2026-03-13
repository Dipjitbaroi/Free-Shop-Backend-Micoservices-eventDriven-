import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service';
import { successResponse, NotFoundError } from '@freeshop/shared-utils';

export const templateController = {
  async createTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const template = await notificationService.createTemplate({
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        channel: req.body.channel,
        subject: req.body.subject,
        body: req.body.body,
        variables: req.body.variables,
      });

      res.status(201).json(successResponse(template, 'Template created'));
    } catch (error) {
      next(error);
    }
  },

  async updateTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const template = await notificationService.updateTemplate(req.params.id, req.body);
      res.json(successResponse(template, 'Template updated'));
    } catch (error) {
      next(error);
    }
  },

  async getTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const template = await notificationService.getTemplate(req.params.id);
      if (!template) throw new NotFoundError('Template not found');

      res.json(successResponse(template, 'Template retrieved'));
    } catch (error) {
      next(error);
    }
  },

  async listTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const templates = await notificationService.listTemplates({
        type: req.query.type as any,
        channel: req.query.channel as any,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
      });

      res.json(successResponse(templates, 'Templates retrieved'));
    } catch (error) {
      next(error);
    }
  },
};
