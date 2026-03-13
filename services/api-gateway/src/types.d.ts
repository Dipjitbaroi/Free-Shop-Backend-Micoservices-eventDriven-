import { ITokenPayload } from '@freeshop/shared-types';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: ITokenPayload;
    }
  }
}

export {};
