import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import mongoose from 'mongoose';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { app, Logger } from '.';
import { COOKIES_NAME, MONGO_DB_URL } from '../Constants';
import { Context, Request } from '../Types';
import ApolloSchema from './Schema';
import jwt from 'jsonwebtoken'

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
                let result;
                const user_agent: string = request.headers['user-agent'] as string;
                if (user_agent.includes('Dart')) {
                    let userId;
                    const bearerToken = request.headers.authorization;

                    const token = bearerToken?.replace('Bearer ', '');

                    if (token) {
                        jwt.verify(token, process.env.JWT_SECRET as string, (err, decode: any) => {
                            if (err) {
                                Logger.error(err);
                            } else {
                                userId = decode.id;
                            }
                        });
                    }

                    result = {
                        ...params,
                        context: {
                            req: {
                                ...request,
                                headers: {
                                    ...request.headers,
                                    locale: request.headers.locale || 'vi',
                                },
                                locale: request.headers['locale'],
                                session: {
                                    userId,
                                }
                            },
                        },
                        schema,
                    };
                } else {
                    const cookies: string = webSocket.upgradeReq.rawHeaders.filter(
                        (header: string) => header.includes(COOKIES_NAME)
                    )[0];

                    const _id = cookies.replace(`${COOKIES_NAME}`, '').split('.')[0].slice(5);

                    await mongoose.connect(MONGO_DB_URL);

                    const collection = mongoose.connection.db.collection('sessions');

                    const session = await collection.findOne({
                        _id,
                    });
                    result = {
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
                                locale: request.headers['locale'],
                            },
                        },
                        schema,
                    };
                }

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
