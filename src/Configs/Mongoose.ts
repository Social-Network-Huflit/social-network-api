import mongoose from 'mongoose';
import { MONGO_DB_URL } from '../Constants';
import Logger from './Logger';

export default async function connectDB() {
    mongoose
        .connect(MONGO_DB_URL as string)
        .then(() => Logger.success(`Connect MongoDB ${process.env.NODE_ENV} successfully`))
        .catch((err) => Logger.error(err));
}
