import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';
import { buildSchema } from 'type-graphql';
import resolvers from '../Resolvers';
import { Context } from '../Types';

export default async function ApolloServerExpress(app: Express){
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers,
        }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
        context: ({ req, res }): Context => ({ req, res }),
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app, cors: false });

    return apolloServer;
}