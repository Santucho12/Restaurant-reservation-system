import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/ErrorHandler';

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  if (err instanceof SyntaxError && 'body' in err) {
    ErrorHandler.badRequest(
      res,
      'badRequest',
      'JSON mal formado en el cuerpo de la solicitud',
    );
    return;
  }
  ErrorHandler.serverInternalError(res, err);
};
