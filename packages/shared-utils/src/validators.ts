import Joi from 'joi';

// Common validation patterns
export const patterns = {
  phone: /^(\+?880)?[0-9]{10,11}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  objectId: /^[a-f\d]{24}$/i,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
};

// Common validation schemas
export const commonSchemas = {
  id: Joi.string().uuid({ version: 'uuidv4' }),
  email: Joi.string().email().lowercase().trim(),
  phone: Joi.string().pattern(patterns.phone).message('Invalid phone number format'),
  password: Joi.string()
    .min(8)
    .max(50)
    .pattern(patterns.password)
    .message('Password must contain at least 8 characters, including uppercase, lowercase, number, and special character'),
  name: Joi.string().min(2).max(100).trim(),
  slug: Joi.string().pattern(patterns.slug).message('Invalid slug format'),
  url: Joi.string().uri(),
  positiveNumber: Joi.number().positive(),
  nonNegativeNumber: Joi.number().min(0),
  percentage: Joi.number().min(0).max(100),
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sortBy: Joi.string(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),
  dateRange: Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso().greater(Joi.ref('startDate')),
  }),
};

// Address validation schema
export const addressSchema = Joi.object({
  fullName: Joi.string().required().min(2).max(100),
  phone: commonSchemas.phone.required(),
  addressLine1: Joi.string().required().min(5).max(200),
  addressLine2: Joi.string().max(200).allow(''),
  city: Joi.string().required().min(2).max(100),
  state: Joi.string().required().min(2).max(100),
  postalCode: Joi.string().required().min(4).max(10),
  country: Joi.string().required().default('Bangladesh'),
});

// Validate function
export const validate = <T>(
  schema: Joi.ObjectSchema,
  data: unknown
): { value: T; error?: string } => {
  const { value, error } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(', ');
    return { value, error: errorMessage };
  }

  return { value };
};

// Validation helper functions
export const isValidEmail = (email: string): boolean => {
  const { error } = Joi.string().email().validate(email);
  return !error;
};

export const isValidPhone = (phone: string): boolean => {
  return patterns.phone.test(phone);
};

export const isValidUUID = (id: string): boolean => {
  return patterns.uuid.test(id);
};

export const isValidSlug = (slug: string): boolean => {
  return patterns.slug.test(slug);
};

export const isValidPassword = (password: string): boolean => {
  return patterns.password.test(password);
};

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*on\w+="[^"]*"[^>]*>/gi, '')
    .replace(/<[^>]*on\w+='[^']*'[^>]*>/gi, '');
};
