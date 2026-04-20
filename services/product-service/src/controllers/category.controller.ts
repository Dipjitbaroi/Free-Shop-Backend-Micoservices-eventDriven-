import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/category.service.js';
import { successResponse } from '@freeshop/shared-utils';

export const categoryController = {
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json(successResponse(category, 'Category created successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const { parentId, includeInactive } = req.query;
      const categories = await categoryService.getCategories(
        parentId as string,
        includeInactive === 'true'
      );
      res.json(successResponse(categories, 'Categories retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getCategoryTree(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getCategoryTree();
      res.json(successResponse(categories, 'Category tree retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.getCategoryById(req.params.id as string);
      res.json(successResponse(category, 'Category retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async getCategoryBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.getCategoryBySlug(req.params.slug as string);
      res.json(successResponse(category, 'Category retrieved successfully'));
    } catch (error) {
      next(error);
    }
  },

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.updateCategory(req.params.id as string, req.body);
      res.json(successResponse(category, 'Category updated successfully'));
    } catch (error) {
      next(error);
    }
  },

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      await categoryService.deleteCategory(req.params.id as string);
      res.json(successResponse(null, 'Category deleted successfully'));
    } catch (error) {
      next(error);
    }
  },

  async toggleCategoryStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { isActive } = req.body;
      const category = await categoryService.toggleCategoryStatus(req.params.id as string, isActive);
      res.json(successResponse(category, `Category ${isActive ? 'activated' : 'deactivated'} successfully`));
    } catch (error) {
      next(error);
    }
  },
};
