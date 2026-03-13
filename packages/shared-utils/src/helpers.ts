import { format, parseISO, addDays, addHours, differenceInDays, isAfter, isBefore } from 'date-fns';
import { IApiResponse, IPaginatedResult, IPaginationParams } from '@freeshop/shared-types';

/**
 * Format date to string
 */
export const formatDate = (date: Date | string, formatStr: string = 'yyyy-MM-dd'): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
};

/**
 * Format date with time
 */
export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, 'yyyy-MM-dd HH:mm:ss');
};

/**
 * Add days to date
 */
export const addDaysToDate = (date: Date, days: number): Date => {
  return addDays(date, days);
};

/**
 * Add hours to date
 */
export const addHoursToDate = (date: Date, hours: number): Date => {
  return addHours(date, hours);
};

/**
 * Check if date is in the past
 */
export const isDateInPast = (date: Date): boolean => {
  return isBefore(date, new Date());
};

/**
 * Check if date is in the future
 */
export const isDateInFuture = (date: Date): boolean => {
  return isAfter(date, new Date());
};

/**
 * Calculate days difference
 */
export const getDaysDifference = (date1: Date, date2: Date): number => {
  return differenceInDays(date1, date2);
};

/**
 * Format price with currency
 */
export const formatPrice = (
  amount: number,
  currency: string = 'BDT',
  locale: string = 'en-BD'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Calculate discount
 */
export const calculateDiscount = (
  originalPrice: number,
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT',
  discountValue: number
): number => {
  if (discountType === 'PERCENTAGE') {
    return (originalPrice * discountValue) / 100;
  }
  return Math.min(discountValue, originalPrice);
};

/**
 * Calculate final price after discount
 */
export const calculateFinalPrice = (
  originalPrice: number,
  discountType?: 'PERCENTAGE' | 'FIXED_AMOUNT',
  discountValue?: number
): number => {
  if (!discountType || !discountValue) {
    return originalPrice;
  }
  const discount = calculateDiscount(originalPrice, discountType, discountValue);
  return Math.max(0, originalPrice - discount);
};

/**
 * Create API response
 */
export const createApiResponse = <T>(
  data?: T,
  message?: string,
  requestId?: string
): IApiResponse<T> => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    requestId,
  };
};

/**
 * Create error response
 */
export const createErrorResponse = (
  code: string,
  message: string,
  details?: Record<string, unknown>,
  requestId?: string
): IApiResponse => {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
    requestId,
  };
};

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  totalItems: number,
  pagination: IPaginationParams
): IPaginatedResult<T>;
export function createPaginatedResponse<T>(
  data: T[],
  totalItems: number,
  page: number,
  limit: number
): IPaginatedResult<T>;
export function createPaginatedResponse<T>(
  data: T[],
  totalItems: number,
  paginationOrPage: IPaginationParams | number,
  limitArg?: number
): IPaginatedResult<T> {
  let page: number;
  let limit: number;

  if (typeof paginationOrPage === 'number') {
    page = paginationOrPage || 1;
    limit = limitArg || 20;
  } else {
    page = paginationOrPage.page || 1;
    limit = paginationOrPage.limit || 20;
  }

  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

/**
 * Calculate pagination offset
 */
export const calculateOffset = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

/**
 * Sleep/delay function
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Retry with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }
  
  throw lastError;
};

/**
 * Chunk array into smaller arrays
 */
export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Remove duplicate items from array
 */
export const uniqueArray = <T>(array: T[], key?: keyof T): T[] => {
  if (key) {
    const seen = new Set();
    return array.filter((item) => {
      const value = item[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }
  return [...new Set(array)];
};

/**
 * Pick specific keys from object
 */
export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

/**
 * Omit specific keys from object
 */
export const omit = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result as Omit<T, K>;
};

/**
 * Check if value is empty
 */
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Alias for createApiResponse (convenience)
 */
export const successResponse = createApiResponse;
