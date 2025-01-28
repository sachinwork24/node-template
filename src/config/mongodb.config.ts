import mongoose from 'mongoose';
import logger from './logger.config';

export default function initializeMongoDb() {
  const mongoDB_URI: string = `${process.env.MONGO_URI}`;
  mongoose.set('strictQuery', false);
  mongoose
    .connect(mongoDB_URI)
    .then(() => {
      logger.info('Connected to the MongoDB'.green);
    })
    .catch((err) => {
      database.on(
        'error',
        console.error.bind(console, 'MongoDb connection error'.red, err)
      );
    });
  const database = mongoose.connection;

  process.on('SIGHT', () => {
    database
      .close()
      .then(() => {
        logger.info('MongoDB connection  closed on app termination'.blue);
        process.exit(0);
      })
      .catch((err) => {
        console.error('error while closing mongoDB'.red, err);
        process.exit(1);
      });
  });
}
