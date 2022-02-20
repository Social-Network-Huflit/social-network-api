import MongoStore from 'connect-mongo';
import express from 'express';
import session from 'express-session';
import { COOKIES_NAME, __prod__ } from '../Constants';

const app = express();

app.use(
    session({
        name: COOKIES_NAME,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_DB_URL }),
        cookie: {
            maxAge: 1000 * 60, //one hour
            httpOnly: true,
            secure: __prod__,
            sameSite: 'lax',
        },
        secret: process.env.SESSION_SECRET as string,
        saveUninitialized: false,
        resave: false,
    })
);

export default app;