import { makeExecutableSchema } from '@graphql-tools/schema';
import { buildSchema, buildTypeDefsAndResolvers } from 'type-graphql';
import LocaleMiddleware from '../Middlewares/Locale.middleware';
import apolloResolvers from '../Resolvers';
import { ChatResolver, ChatTypeDefs } from '../Resolvers/Chat/Subscription';

export default async function ApolloSchema() {
    const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
        resolvers: apolloResolvers,
        globalMiddlewares: [LocaleMiddleware],
        validate: false,
    });

    const schema = makeExecutableSchema({
        typeDefs: [typeDefs, ChatTypeDefs],
        resolvers: [resolvers, ChatResolver],
    });

    return schema;
}
