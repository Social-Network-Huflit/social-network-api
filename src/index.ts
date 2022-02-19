require('reflect-metadata');
require('dotenv').config();
import express from 'express';
import { createConnection } from 'typeorm';
import Logger from './Configs/Logger';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import mongoose from 'mongoose';
import { Context } from './Types/Context';
import { COOKIES_NAME, __prod__ } from './Constants/';
import HelloResolver from './Resolvers/Hello';
import User from './Entities/User';
import AuthResolver from './Resolvers/Auth';

const main = async () => {
    await createConnection({
        type: 'postgres',
        database: '',
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        logging: true,
        synchronize: true,
        entities: [User],
    });

    const app = express();
    const PORT = process.env.PORT || 4000;

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, AuthResolver],
        }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
        context: ({ req, res }): Context => ({ req, res }),
    });

    //session
    const mongoUrl = process.env.MONGODB_URL as string;
    await mongoose.connect(mongoUrl);

    Logger.success('MongoDB is connected');

    app.use(
        session({
            name: COOKIES_NAME,
            store: MongoStore.create({ mongoUrl }),
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

    await apolloServer.start();

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(PORT, () =>
        Logger.success(`Server is running on: http://localhost:${PORT}${apolloServer.graphqlPath}`)
    );
};

main().catch((err) => console.log(err));
