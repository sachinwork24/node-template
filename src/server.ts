import express, { Express, Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
import initializeMongoDb from './config/mongodb.config';
import 'colors';
import cors from 'cors';
import router from './routes';
import helmet from 'helmet';
import path from 'path';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error.middleware';
import morgan from 'morgan';
import logger from './config/logger.config';
//initialization
dotenv.config();
initializeMongoDb();
const PORT = process.env.PORT || 5000;
import { CORS_ACCESS } from './CONSTANTS';

const app: Express = express();
const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    if (!origin || CORS_ACCESS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not Allowed By CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  allowedHeaders: [
    'Origin',
    'Content-Type',
    'Authorization',
    'Expires',
    'Pragma',
  ],
  credentials: true,
};

//middleware
app.use(cors(corsOptions));
app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => {
        logger.info(message.trim());
      },
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());

//routes
app.use('/', router);
//@ts-ignore
app.use(errorHandler);
//server live
app.listen(PORT, () => {
  logger.info(`Server Live at http://localhost:${PORT}`.blue);
});
