import mongoose from 'mongoose';
import Logger from './Logger';

export default async function connectDB() {
    mongoose
        .connect(process.env.MONGO_DB_URL as string)
        .then(() => Logger.success('Connect MongoDB successfully'))
        .catch((err) => Logger.error(err));
}
