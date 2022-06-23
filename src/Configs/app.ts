import MongoStore from 'connect-mongo';
import express from 'express';
import session from 'express-session';
import path, { join } from 'path';
import { graphqlUploadExpress } from 'graphql-upload';
import { COOKIES_NAME, MONGO_DB_URL, __prod__ } from '../Constants';
import i18n from 'i18n';
import cors from 'cors';

import moment from 'moment';


const device = require('express-device');
const app = express();

i18n.configure({
    locales: ['en', 'vi'],
    directory: path.join(__dirname, '../languages/i18n'),
    defaultLocale: 'en',
    register: global,
    objectNotation: true,
});

app.use(
    cors({
        origin: 'http://localhost:4200',
        credentials: true,
    })
);
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
app.use(graphqlUploadExpress());
app.use(express.static(join(__dirname, '../public')));
moment.locale("vi")

export default app;
