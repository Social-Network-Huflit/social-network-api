import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { app } from '.';
import { COOKIES_NAME, MONGO_DB_URL } from '../Constants';
import { Context, Request } from '../Types';
import ApolloSchema from './Schema';

export default async function ApolloServerExpress() {
    const httpServer = createServer(app);
    const schema = await ApolloSchema();
    let request: Request;

    const subscriptionsServer = SubscriptionServer.create(
        {
            schema,
            subscribe,
            execute,
            onConnect: (params: any, params2: any, params3: any) => {
                request = params3.request;
            },
            onOperation: async (message: any, params: any, webSocket: any) => {
                const cookies: string = webSocket.upgradeReq.rawHeaders.filter((header: string) =>
                    header.includes(COOKIES_NAME)
                )[0];

                const _id = cookies.replace(`${COOKIES_NAME}`, '').split('.')[0].slice(5);

                const connection = await mongoose.connect(MONGO_DB_URL);

                const collection = mongoose.connection.db.collection('sessions');

                const session = await collection.findOne({
                    _id,
                });

                const result = {
                    ...params,
                    context: {
                        req: {
                            ...request,
                            headers: {
                                ...request.headers,
                                locale: request.headers.locale || 'vi',
                            },
                            session: {
                                userId: JSON.parse((session as any).session).userId,
                            },
                            locale: 'en',
                        },
                    },
                    schema,
                };

                return result;
            },
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
