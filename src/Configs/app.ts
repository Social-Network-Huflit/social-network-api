import { MONGO_DB_URL, __prod__ } from '@Constants/index';
import { COOKIES_NAME } from '@Constants/index';
import MongoStore from 'connect-mongo';
import express from 'express';
import session from 'express-session';
import i18n from 'i18n';
import path from 'path';

const device = require('express-device');
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
        store: MongoStore.create({ mongoUrl: MONGO_DB_URL }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 60, //one hour
            httpOnly: true,
            secure: __prod__,
            sameSite: 'lax',
        },
        secret: process.env.SESSION_SECRET as string,
        saveUninitialized: false,
        resave: false,
    })
);

app.use(i18n.init);
app.use(device.capture());

export default app;
