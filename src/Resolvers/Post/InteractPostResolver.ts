import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { Context, IMutationResponse, ServerInternal } from '@Types';
import { Logger } from '@Configs';
import { Post, PostLike, User } from '@Entities';
import i18n from 'i18n';

@Resolver()
export default class InteractPostResolver {
    @Mutation(() => IMutationResponse)
    async likePost(
        @Arg('post_id') post_id: number,
        @Ctx() { req }: Context
    ): Promise<IMutationResponse> {
        try {
            const owner = await User.getMyUser(req);
            const post = await Post.findOne({
                id: post_id,
                active: true,
            });

            if (!post) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_POST_FAIL'),
                };
            }

            const existingLike = await PostLike.findOne({
                post,
                owner,
            });

            if (!existingLike) {
                const newLike = PostLike.create({
                    post,
                    owner,
                });

                await newLike.save();

                return {
                    code: 200,
                    success: true,
                    message: i18n.__('POST.LIKE_POST_SUCCESS'),
                };
            } else {
                await PostLike.remove(existingLike);

                return {
                    code: 200,
                    success: true,
                    message: i18n.__('POST.UNLIKE_POST_SUCCESS'),
                };
            }
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error);
        }
    }
}
