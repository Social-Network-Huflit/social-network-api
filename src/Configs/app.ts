import MongoStore from 'connect-mongo';
import express from 'express';
import session from 'express-session';
import { COOKIES_NAME, __prod__ } from '../Constants';
import i18n from 'i18n';
import path from 'path';

const device = require('express-device')
const app = express();

i18n.configure({
    locales: ['en', 'vi'],
    directory: path.join(__dirname, '../languages/i18n'),
    defaultLocale: 'vi',
    register: global,
    objectNotation: true,
});

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

app.use(i18n.init)
app.use(device.capture());

export default app;