import { Context } from '../Types';
import { AuthenticationError } from 'apollo-server-core';
import { MiddlewareFn } from 'type-graphql';
import CheckLogged from '../Utils/CheckLogged';

export const Authentication: MiddlewareFn<Context> = async ({ context: { req } }, next) => {
    if (await CheckLogged(req)) {
        return next();
    } else {
        throw new AuthenticationError('You have to login first');
    }
};
