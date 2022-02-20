import { MiddlewareFn } from "type-graphql";
import { Context, JWTPayload } from "../Types";
import jwt from 'jsonwebtoken'
import { AuthenticationError } from "apollo-server-core";

export const Authentication: MiddlewareFn<Context> = async ({context: {req}}, next) => {
    const token = req.session.token;

    if (!token){
        throw new AuthenticationError("You have to login first");
    }

    //verify token
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decode) => {
        if (err){
            throw new AuthenticationError(err.message)
        };

        req.userId = (decode as JWTPayload).userId
    });

    return next();
}