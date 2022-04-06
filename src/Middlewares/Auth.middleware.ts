import { Context } from '../Types';
import { AuthenticationError } from 'apollo-server-core';
import { MiddlewareFn } from 'type-graphql';

export const Authentication: MiddlewareFn<Context> = async ({ context: { req } }, next) => {
    const userId = req.session.userId;

    if (!userId) {
        throw new AuthenticationError('You have to login first');
    }

    return next();
};
