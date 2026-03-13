import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError, createErrorResponse, Logger } from '@freeshop/shared-utils';

const logger = new Logger('error-handler');

/**
 * Global error handler middleware
 */
export const errorHandler: ErrorRequestHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const requestId = req.requestId || 'unknown';

  // Client disconnected before the server finished — nothing to respond to.
  // raw-body sets type='request.aborted'; Node also sets code='ECONNABORTED'.
  const errAny = error as any;
  if (
    errAny.type === 'request.aborted' ||
    errAny.code === 'ECONNABORTED' ||
    error.message === 'request aborted'
  ) {
    logger.debug('Client disconnected before response was sent', {
      requestId,
      path: req.path,
      method: req.method,
    });
    return; // socket is gone — do not attempt to write
  }

  // If the socket is already closed, skip writing but still log.
  const socketGone = res.headersSent || !req.socket?.writable;

  // Log error
  logger.error(error.message, error, {
    requestId,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userId: req.user?.userId,
  });

  if (socketGone) return;

  // Handle AppError
  if (error instanceof AppError) {
    res.status(error.statusCode).json(
      createErrorResponse(error.code, error.message, error.details, requestId)
    );
    return;
  }

  // Handle validation errors from express-validator
  if (error.name === 'ValidationError') {
    res.status(422).json(
      createErrorResponse('VALIDATION_ERROR', error.message, undefined, requestId)
    );
    return;
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    res.status(401).json(
      createErrorResponse('UNAUTHORIZED', 'Invalid or expired token', undefined, requestId)
    );
    return;
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as unknown as { code: string; meta?: { target?: string[]; cause?: string; field_name?: string } };

    switch (prismaError.code) {
      case 'P2002':
        res.status(409).json(
          createErrorResponse(
            'DUPLICATE_ENTRY',
            `Duplicate entry for ${prismaError.meta?.target?.join(', ') || 'field'}`,
            undefined,
            requestId
          )
        );
        return;

      case 'P2025':
        res.status(404).json(
          createErrorResponse('NOT_FOUND', 'Resource not found', undefined, requestId)
        );
        return;

      case 'P2003':
        res.status(400).json(
          createErrorResponse(
            'FOREIGN_KEY_CONSTRAINT',
            'Related resource not found',
            undefined,
            requestId
          )
        );
        return;

      case 'P2014':
        res.status(400).json(
          createErrorResponse(
            'RELATION_VIOLATION',
            'The operation would violate a required relation',
            undefined,
            requestId
          )
        );
        return;

      case 'P2016':
        res.status(400).json(
          createErrorResponse('QUERY_ERROR', 'Query interpretation error', undefined, requestId)
        );
        return;

      default:
        res.status(400).json(
          createErrorResponse('DATABASE_ERROR', 'Database request error', undefined, requestId)
        );
        return;
    }
  }

  if (error.name === 'PrismaClientValidationError') {
    res.status(400).json(
      createErrorResponse('VALIDATION_ERROR', 'Invalid data provided', undefined, requestId)
    );
    return;
  }

  if (error.name === 'PrismaClientUnknownRequestError') {
    res.status(500).json(
      createErrorResponse('DATABASE_ERROR', 'An unexpected database error occurred', undefined, requestId)
    );
    return;
  }

  // Handle syntax errors in JSON
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json(
      createErrorResponse('INVALID_JSON', 'Invalid JSON in request body', undefined, requestId)
    );
    return;
  }

  // Default to internal server error
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : error.message;

  res.status(500).json(
    createErrorResponse('INTERNAL_SERVER_ERROR', message, undefined, requestId)
  );
};

/**
 * Not found handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const requestId = req.requestId || 'unknown';
  
  res.status(404).json(
    createErrorResponse(
      'NOT_FOUND',
      `Route ${req.method} ${req.originalUrl} not found`,
      undefined,
      requestId
    )
  );
};

/**
 * Async handler wrapper to catch errors
 */
export const asyncHandler = <T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Skip entirely if the TCP socket is gone (client disconnected).
    // NOTE: req.destroyed is true after body parsing (stream consumed) — that is
    // normal. Use req.socket?.destroyed to check for actual disconnection.
    if (req.socket?.destroyed) {
      return;
    }
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
