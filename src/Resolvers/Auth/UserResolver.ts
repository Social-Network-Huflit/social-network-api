import { User } from '@Entities';
import { Authentication } from '@Middlewares/Auth.middleware';
import { Context } from '@Types';
import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';

@Resolver(() => User)
export default class UserResolver {
    //Get My user
    @UseMiddleware(Authentication)
    @Query(() => User, { nullable: true })
    async getMyUser(@Ctx() { req }: Context): Promise<User | null | undefined> {
        const user = await User.findOne(req.session.userId);
        return user;
    }
}
