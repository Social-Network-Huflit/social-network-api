import MongoStore from 'connect-mongo';
import express from 'express';
import session from 'express-session';
import path from 'path';
import { graphqlUploadExpress } from 'graphql-upload';
import { COOKIES_NAME, MONGO_DB_URL, __prod__ } from '../Constants';

const device = require('express-device');
const app = express();

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

app.use(device.capture());
app.use(graphqlUploadExpress());

export default app;
