require('reflect-metadata');
require('dotenv').config();
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import MongoStore from 'connect-mongo';
import express from 'express';
import session from 'express-session';
import { buildSchema } from 'type-graphql';
import Logger from './Configs/Logger';
import connectDB from './Configs/Mongoose';
import { COOKIES_NAME, __prod__ } from './Constants/';
import AuthResolver from './Resolvers/Auth';
import HelloResolver from './Resolvers/Hello';
import { Context } from './Types/Context';

const main = async () => {
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
    await connectDB();

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

    await apolloServer.start();

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(PORT, () =>
        Logger.success(`Server is running on: http://localhost:${PORT}${apolloServer.graphqlPath}`)
    );
};

main().catch((err) => console.log(err));
