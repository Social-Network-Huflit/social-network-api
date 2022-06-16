import { Arg, Ctx, FieldResolver, ID, Mutation, Resolver, Root, UseMiddleware } from 'type-graphql';
import { HistorySearch, User } from '../../Entities';
import { Authentication } from '../../Middlewares/Auth.middleware';
import { Context, IMutationResponse } from '../../Types';

@Resolver(() => HistorySearch)
export default class HistorySearchResolver {
    @FieldResolver(() => User, { nullable: true })
    async owner(@Root() root: HistorySearch): Promise<User | null | undefined> {
        return await User.findOne(root.user_id_1);
    }

    @FieldResolver(() => User, { nullable: true })
    async user(@Root() root: HistorySearch): Promise<User | null | undefined> {
        return await User.findOne(root.user_id_2);
    }

    @UseMiddleware(Authentication)
    @Mutation(() => IMutationResponse)
    async writeHistory(
        @Arg('user_id', () => ID) user_id: number,
        @Ctx() { req }: Context
    ): Promise<IMutationResponse> {
        const myUser = await User.getMyUser(req);

        const existingHistory = await HistorySearch.findOne({
            user_id_1: myUser.id,
            user_id_2: user_id,
        });

        if (existingHistory) {
            await HistorySearch.update(
                {
                    user_id_1: myUser.id,
                    user_id_2: user_id,
                },
                {}
            );

            return {
                code: 200,
                success: true,
                message: 'SUCCESS',
            };
        } else {
            const newHistory = HistorySearch.create({
                user_id_1: myUser.id,
                user_id_2: user_id,
            });

            await newHistory.save();

            return {
                code: 201,
                success: true,
                message: 'SUCCESS',
            };
        }
    }
}
