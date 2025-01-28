import { NextFunction, Request, Response } from 'express';
import logger from '../config/logger.config';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public override message: string,
    public logout: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      logout: err.logout,
    });
  }
  logger.error(`${err.stack}`);
  console.error('Unexpected error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};
