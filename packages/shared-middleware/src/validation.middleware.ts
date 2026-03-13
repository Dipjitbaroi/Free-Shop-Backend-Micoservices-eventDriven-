import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain, ValidationError } from 'express-validator';
import { createErrorResponse } from '@freeshop/shared-utils';

/**
 * Shared logic: check accumulated express-validator results and respond or continue.
 */
function checkValidationResult(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
    return;
  }

  const formattedErrors = errors.array().map((err: ValidationError) => ({
    field: 'path' in err ? err.path : 'unknown',
    message: err.msg,
    value: 'value' in err ? err.value : undefined,
  }));

  res.status(422).json(
    createErrorResponse(
      'VALIDATION_ERROR',
      'Validation failed',
      { errors: formattedErrors },
      req.requestId
    )
  );
}

/**
 * Dual-mode validation middleware.
 *
 * Factory mode  — pass chains, get back a middleware that runs them then checks results:
 *   router.post('/path', validate(myChains), handler)
 *
 * Plain middleware mode — pass validation chains inline before `validate`, then
 * use it directly to check the accumulated results:
 *   router.post('/path', ...myChains, validate, handler)
 */
export function validate(validations: ValidationChain[]): (req: Request, res: Response, next: NextFunction) => Promise<void>;
export function validate(req: Request, res: Response, next: NextFunction): void;
export function validate(
  first: ValidationChain[] | Request,
  res?: Response,
  next?: NextFunction,
): ((req: Request, res: Response, next: NextFunction) => Promise<void>) | void {
  // Factory mode: validate([...chains])
  if (Array.isArray(first)) {
    const validations = first;
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      await Promise.all(validations.map(v => v.run(req)));
      checkValidationResult(req, res, next);
    };
  }

  // Plain middleware mode: validate(req, res, next)
  checkValidationResult(first as Request, res!, next!);
}

/**
 * Validate pagination parameters
 */
export const validatePagination = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 20;

  // Enforce limits
  req.query.page = String(Math.max(1, page));
  req.query.limit = String(Math.min(Math.max(1, limit), 100));

  next();
};

/**
 * Sanitize query parameters
 */
export const sanitizeQuery = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // Remove empty string values
  Object.keys(req.query).forEach(key => {
    if (req.query[key] === '') {
      delete req.query[key];
    }
  });

  // Trim string values
  Object.keys(req.query).forEach(key => {
    if (typeof req.query[key] === 'string') {
      req.query[key] = (req.query[key] as string).trim();
    }
  });

  next();
};

/**
 * Validate UUID parameter
 */
export const validateUUID = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const uuid = req.params[paramName];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuid || !uuidRegex.test(uuid)) {
      res.status(400).json(
        createErrorResponse(
          'INVALID_UUID',
          `Invalid ${paramName} format`,
          undefined,
          req.requestId
        )
      );
      return;
    }

    next();
  };
};

/**
 * Validate request body exists
 */
export const requireBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json(
      createErrorResponse(
        'EMPTY_BODY',
        'Request body is required',
        undefined,
        req.requestId
      )
    );
    return;
  }

  next();
};

/**
 * Validate content type
 */
export const requireContentType = (contentType: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.is(contentType)) {
      res.status(415).json(
        createErrorResponse(
          'UNSUPPORTED_MEDIA_TYPE',
          `Content-Type must be ${contentType}`,
          undefined,
          req.requestId
        )
      );
      return;
    }

    next();
  };
};
