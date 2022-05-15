import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { app } from '.';
import { Context } from '../Types';
import ApolloSchema from './Schema';

export default async function ApolloServerExpress() {
    const httpServer = createServer(app);
    const schema = await ApolloSchema();

    const subscriptionsServer = SubscriptionServer.create(
        {
            schema,
            subscribe,
            execute,
        },
        {
            server: httpServer,
            path: '/graphql',
        }
    );

    const apolloServer = new ApolloServer({
        schema,
        context: ({ req, res }): Context => ({ req, res }),
        plugins: [
            ApolloServerPluginLandingPageGraphQLPlayground(),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            subscriptionsServer.close();
                        },
                    };
                },
            },
        ],
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app, cors: false });

    return { apolloServer, httpServer };
}
