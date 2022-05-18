import { makeExecutableSchema } from '@graphql-tools/schema';
import { buildSchema, buildTypeDefsAndResolvers } from 'type-graphql';
import LocaleMiddleware from '../Middlewares/Locale.middleware';
import apolloResolvers from '../Resolvers';

export default async function ApolloSchema() {
    const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
        resolvers: apolloResolvers,
        globalMiddlewares: [LocaleMiddleware],
        validate: false,
    });

    const schema = makeExecutableSchema({
        typeDefs: [typeDefs],
        resolvers: [resolvers],
    });

    return schema;
}
