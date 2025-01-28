import winston from 'winston';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    //daily rotating error logs
    new DailyRotateFile({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
      datePattern: 'YYYY-MM-DD', // Rotate logs daily
      zippedArchive: true, // Compress old logs
      maxSize: '20m', // Rotate logs when they reach 20MB
      maxFiles: '30d', // Keep logs for 30 days (1 month)
    }),
    //daily rotating combined logs
    new DailyRotateFile({
      filename: path.join(__dirname, '../../logs/combined.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
export default logger;
