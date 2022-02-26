import LocaleMiddleware from '@Middlewares/Locale.middleware';
import resolvers from '@Resolvers';
import { Context } from '@Types';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';
import { buildSchema } from 'type-graphql';

export default async function ApolloServerExpress(app: Express){
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers,
            globalMiddlewares: [LocaleMiddleware],
            validate: false
        }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
        context: ({ req, res }): Context => ({ req, res }),
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app, cors: false });

    return apolloServer;
}