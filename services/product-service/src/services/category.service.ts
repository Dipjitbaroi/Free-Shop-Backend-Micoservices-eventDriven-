import { Prisma, Category } from '../../generated/client/client.js';
import { ICategoryCreate } from '@freeshop/shared-types';
import { generateSlug, NotFoundError, BadRequestError } from '@freeshop/shared-utils';
import { prisma } from '../lib/prisma.js';
import { 
  cacheGet, 
  cacheSet, 
  cacheDelete,
  cacheDeletePattern,
  categoryCacheKey,
  categoryListCacheKey,
} from '../lib/redis.js';
import config from '../config/index.js';

class CategoryService {
  async createCategory(data: ICategoryCreate): Promise<Category> {
    const slug = generateSlug(data.name);

    // Check for duplicate slug
    const existingSlug = await prisma.category.findUnique({
      where: { slug },
    });

    const finalSlug = existingSlug 
      ? `${slug}-${Date.now().toString(36)}` 
      : slug;

    // Calculate level based on parent
    let level = 0;
    if (data.parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: data.parentId },
      });
      if (!parent) {
        throw new NotFoundError(`Parent category not found: ${data.parentId}`);
      }
      level = parent.level + 1;
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: finalSlug,
        description: data.description,
        image: data.image,
        parentId: data.parentId,
        level,
        sortOrder: data.sortOrder || 0,
      },
    });

    // Clear cache
    await cacheDeletePattern('categories:*');

    return category;
  }

  async getCategoryById(id: string): Promise<Category> {
    const cached = await cacheGet<Category>(categoryCacheKey(id));
    if (cached) return cached;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    await cacheSet(categoryCacheKey(id), category, config.cache.categoryTTL);

    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return category;
  }

  async getCategories(
    parentId?: string,
    includeInactive: boolean = false
  ): Promise<Category[]> {
    const where: Prisma.CategoryWhereInput = {};
    
    if (parentId) {
      where.parentId = parentId;
    } else {
      where.parentId = null; // Root categories
    }

    if (!includeInactive) {
      where.isActive = true;
    }

    return prisma.category.findMany({
      where,
      include: {
        children: {
          where: includeInactive ? {} : { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getCategoryTree(): Promise<Category[]> {
    const cached = await cacheGet<Category[]>(categoryListCacheKey());
    if (cached) return cached;

    // Get all root categories with their children
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
        parentId: null,
      },
      include: {
        children: {
          where: { isActive: true },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    await cacheSet(categoryListCacheKey(), categories, config.cache.categoryTTL);

    return categories;
  }

  async updateCategory(id: string, data: Partial<ICategoryCreate>): Promise<Category> {
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundError('Category not found');
    }

    const updateData: Prisma.CategoryUpdateInput = {};

    if (data.name) {
      updateData.name = data.name;
      updateData.slug = generateSlug(data.name);
    }
    if (data.description !== undefined) updateData.description = data.description;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
    if (data.parentId !== undefined) {
      if (data.parentId) {
        const parent = await prisma.category.findUnique({
          where: { id: data.parentId },
        });
        if (parent) {
          updateData.parent = { connect: { id: data.parentId } };
          updateData.level = parent.level + 1;
        }
      } else {
        updateData.parent = { disconnect: true };
        updateData.level = 0;
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    // Clear cache
    await Promise.all([
      cacheDelete(categoryCacheKey(id)),
      cacheDeletePattern('categories:*'),
    ]);

    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: { take: 1 }, children: { take: 1 } },
    });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    if (category.products.length > 0) {
      throw new BadRequestError('Cannot delete category with products');
    }

    if (category.children.length > 0) {
      throw new BadRequestError('Cannot delete category with subcategories');
    }

    await prisma.category.delete({
      where: { id },
    });

    // Clear cache
    await Promise.all([
      cacheDelete(categoryCacheKey(id)),
      cacheDeletePattern('categories:*'),
    ]);
  }

  async toggleCategoryStatus(id: string, isActive: boolean): Promise<Category> {
    const category = await prisma.category.update({
      where: { id },
      data: { isActive },
    });

    await Promise.all([
      cacheDelete(categoryCacheKey(id)),
      cacheDeletePattern('categories:*'),
    ]);

    return category;
  }
}

export const categoryService = new CategoryService();
