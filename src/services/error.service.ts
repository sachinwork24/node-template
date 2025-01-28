import { Response } from 'express';
export default function sendErrorResponse(
  res: Response,
  statusCode: number,
  message: string
) {
  return res.status(statusCode).json({
    message,
    success: false,
  });
}
