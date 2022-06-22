import { buildSchema } from 'type-graphql';
import LocaleMiddleware from '../Middlewares/Locale.middleware';
import resolvers from '../Resolvers';

export default async function ApolloSchema() {
    return await buildSchema({
        resolvers,
        globalMiddlewares: [LocaleMiddleware],
        validate: false,
    });
}
