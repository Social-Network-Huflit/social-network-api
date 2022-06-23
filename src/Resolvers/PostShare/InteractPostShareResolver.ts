import {
    Arg,
    Ctx,
    ID,
    Mutation,
    Resolver,
    UseMiddleware,
    PubSub,
    PubSubEngine,
} from 'type-graphql';
import { Logger } from '../../Configs';
import {
    PostShare,
    PostShareComment,
    PostShareCommentLike,
    PostShareLike,
    PostShareReplyComment,
    PostShareReplyCommentLike,
    User,
    Notify,
} from '../../Entities';
import { Authentication } from '../../Middlewares/Auth.middleware';
import {
    CommentPostShareMutationResponse,
    Context,
    CreateCommentPostShareInput,
    IMutationResponse,
    PostShareMutationResponse,
    ReplyCommentPostShareInput,
    ReplyCommentPostShareMutationResponse,
    ServerInternal,
    UpdateCommentPostShareInput,
} from '../../Types';
import { NEW_NOTI, ACTIONS } from '../../Constants/subscriptions.constant';

import UpdateEntity from '../../Utils/UpdateEntity';
import ValidateInput from '../../Utils/Validation';
import i18n from 'i18n';

@Resolver()
export default class InteractPostShareResolver {
    //Like post share
    @UseMiddleware(Authentication)
    @Mutation(() => PostShareMutationResponse)
    async likePostShare(
        @Arg('post_share_id', () => ID) post_share_id: number,
        @Arg('like_type') like_type: 'like' | 'haha' | 'sad' | 'wow' | 'angry',
        @Ctx() { req }: Context,
        @PubSub() pubSub: PubSubEngine
    ): Promise<PostShareMutationResponse> {
        try {
            let notify: Notify | undefined = undefined;

            const owner = await User.getMyUser(req);
            const post_share = await PostShare.findOne({
                id: post_share_id,
            });

            if (!post_share) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_POST_FAIL'),
                };
            }

            const existingLike = await PostShareLike.findOne({
                post_share,
                owner,
            });

            if (!existingLike) {
                const newLike = PostShareLike.create({
                    post_share_id: post_share.id,
                    user_id: owner.id,
                    like_type,
                });

                await newLike.save();
                const newNotify = Notify.create({
                    action: ACTIONS.EXPRESS,
                    message: ` đã bày tỏ cảm xúc về bài viết của bạn`,
                    to_id: post_share?.user_id,
                    post_id: post_share.id,
                    from_id: owner.id,
                });
                notify = await newNotify.save();
                pubSub.publish(NEW_NOTI, notify);
                return {
                    code: 200,
                    success: true,
                    message: i18n.__('POST.LIKE_POST_SUCCESS'),
                };
            } else {
                await PostShareLike.remove(existingLike);

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

    //Create comment Post Share
    @UseMiddleware(Authentication)
    @Mutation(() => CommentPostShareMutationResponse)
    async commentPostShare(
        @Arg('createCommentInput') createCommentInput: CreateCommentPostShareInput,
        @Ctx() { req }: Context,
        @PubSub() pubSub: PubSubEngine
    ): Promise<CommentPostShareMutationResponse> {
        try {
            let notify: Notify | undefined = undefined;

            const validate = await ValidateInput(req, createCommentInput);

            if (validate) return validate;

            const owner = await User.getMyUser(req);

            const post_share = await PostShare.findOne({
                id: createCommentInput.post_share_id,
            });

            if (!post_share) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_POST_FAIL'),
                };
            }

            const newComment = PostShareComment.create({
                owner,
                post_share,
                ...createCommentInput,
            });
            const newNotify = Notify.create({
                action: ACTIONS.COMMENT,
                message: ` đã bình luận về bài viết của bạn`,
                to_id: post_share?.user_id,
                post_id: post_share.id,
                from_id: owner.id,
            });
            notify = await newNotify.save();
            pubSub.publish(NEW_NOTI, notify);
            return {
                code: 201,
                success: true,
                message: i18n.__('POST.COMMENT_POST_SUCCESS'),
                result: await newComment.save(),
            };
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error);
        }
    }

    //Update Comment Post Share
    @UseMiddleware(Authentication)
    @Mutation(() => CommentPostShareMutationResponse)
    async updateCommentPostShare(
        @Arg('updateCommentInput') updateCommentInput: UpdateCommentPostShareInput,
        @Ctx() { req }: Context
    ): Promise<CommentPostShareMutationResponse> {
        try {
            const validate = await ValidateInput(req, updateCommentInput);

            if (validate) return validate;

            const comment = await PostShareComment.findOne({
                id: updateCommentInput.id,
            });

            if (!comment) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_COMMENT_FAIL'),
                };
            }

            const updatedComment = await UpdateEntity(
                PostShareComment,
                comment,
                updateCommentInput
            );

            return {
                code: 200,
                success: true,
                message: i18n.__('POST.UPDATE_COMMENT_SUCCESS'),
                result: updatedComment,
            };
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error.message);
        }
    }

    //Delete comment post share
    @UseMiddleware(Authentication)
    @Mutation(() => IMutationResponse)
    async deleteCommentPostShare(
        @Arg('comment_id') comment_id: number,
        @Ctx() { req }: Context
    ): Promise<IMutationResponse> {
        try {
            const comment = await PostShareComment.findOne({
                id: comment_id,
            });

            if (!comment) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_COMMENT_FAIL'),
                };
            }

            const post_share = await PostShare.findOne({
                id: comment.post_share_id,
            });

            if (!post_share) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_POST_FAIL'),
                };
            }

            if (
                post_share.user_id === req.session.userId ||
                comment.user_id === req.session.userId
            ) {
                //post owner && comment owner can delete

                await PostShareComment.softRemove(comment);

                return {
                    code: 200,
                    success: true,
                    message: i18n.__('POST.DELETE_COMMENT_POST_SUCCESS'),
                };
            } else {
                return {
                    code: 401,
                    success: false,
                    message: i18n.__('POST.DELETE_COMMENT_POST_FAIL'),
                };
            }
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error.message);
        }
    }

    //Delete comment post share
    @UseMiddleware(Authentication)
    @Mutation(() => IMutationResponse)
    async deleteReplyCommentPostShare(
        @Arg('reply_comment_id') reply_comment_id: number,
        @Ctx() { req }: Context
    ): Promise<IMutationResponse> {
        try {
            const reply_comment = await PostShareReplyComment.findOne({
                id: reply_comment_id,
            });

            if (!reply_comment) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_COMMENT_FAIL'),
                };
            }

            const comment = await PostShareComment.findOne({
                id: reply_comment.post_share_comment_id,
            });

            if (!comment) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_COMMENT_FAIL'),
                };
            }

            const post_share = await PostShare.findOne({
                id: comment.post_share_id,
            });

            if (!post_share) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_POST_FAIL'),
                };
            }

            if (
                post_share.user_id === req.session.userId ||
                reply_comment.user_id === req.session.userId
            ) {
                //post owner && comment owner can delete

                await PostShareReplyComment.softRemove(reply_comment);

                return {
                    code: 200,
                    success: true,
                    message: i18n.__('POST.DELETE_COMMENT_POST_SUCCESS'),
                };
            } else {
                return {
                    code: 401,
                    success: false,
                    message: i18n.__('POST.DELETE_COMMENT_POST_FAIL'),
                };
            }
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error.message);
        }
    }

    //Like comment post share
    @UseMiddleware(Authentication)
    @Mutation(() => CommentPostShareMutationResponse)
    async likeCommentPostShare(
        @Arg('comment_id', () => ID) comment_id: number,
        @Arg('like_type') like_type: 'like' | 'haha' | 'sad' | 'wow' | 'angry',
        @Ctx() { req }: Context,
        @PubSub() pubSub: PubSubEngine
    ): Promise<CommentPostShareMutationResponse> {
        try {
            let notify: Notify | undefined = undefined;

            const owner = await User.getMyUser(req);
            const comment = await PostShareComment.findOne({
                id: comment_id,
            });

            if (!comment) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_COMMENT_FAIL'),
                };
            }

            const existingLike = await PostShareCommentLike.findOne({
                comment,
                owner,
            });

            if (!existingLike) {
                const newLike = PostShareCommentLike.create({
                    comment,
                    owner,
                    like_type,
                });

                await newLike.save();
                const newNotify = Notify.create({
                    action: ACTIONS.EXPRESS,
                    message: ` đã bày tỏ cảm xúc về bình luận của bạn`,
                    to_id: comment?.user_id,
                    post_id: comment.post_share_id,
                    from_id: owner.id,
                });
                notify = await newNotify.save();
                pubSub.publish(NEW_NOTI, notify);
                return {
                    code: 200,
                    success: true,
                    message: i18n.__('POST.LIKE_COMMENT_SUCCESS'),
                };
            } else {
                await PostShareCommentLike.remove(existingLike);

                return {
                    code: 200,
                    success: true,
                    message: i18n.__('POST.UNLIKE_COMMENT_SUCCESS'),
                };
            }
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error);
        }
    }

    //Reply comment post share
    @UseMiddleware(Authentication)
    @Mutation(() => ReplyCommentPostShareMutationResponse)
    async replyCommentPostShare(
        @Arg('replyCommentPostInput') replyCommentPostInput: ReplyCommentPostShareInput,
        @Ctx() { req }: Context,
        @PubSub() pubSub: PubSubEngine
    ): Promise<ReplyCommentPostShareMutationResponse> {
        try {
            let notify: Notify | undefined = undefined;

            const validate = await ValidateInput(req, replyCommentPostInput);

            if (validate) return validate;

            const comment = await PostShareComment.findOne({
                id: replyCommentPostInput.comment_id,
            });

            if (!comment) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_COMMENT_FAIL'),
                };
            }

            const owner = await User.getMyUser(req);

            const newReplyComment = PostShareReplyComment.create({
                ...replyCommentPostInput,
                owner,
                comment,
            });
            const newNotify = Notify.create({
                action: ACTIONS.COMMENT,
                message: ` đã trả lời bình luận của bạn`,
                to_id: comment?.user_id,
                post_id: comment.post_share_id,
                from_id: owner.id,
            });
            notify = await newNotify.save();
            pubSub.publish(NEW_NOTI, notify);
            return {
                code: 201,
                success: true,
                message: i18n.__('POST.REPLY_COMMENT_SUCCESS'),
                result: await newReplyComment.save(),
            };
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error.message);
        }
    }

    //Like reply comment post
    @UseMiddleware(Authentication)
    @Mutation(() => ReplyCommentPostShareMutationResponse)
    async likeReplyCommentPostShare(
        @Arg('reply_comment_id', () => ID) reply_comment_id: number,
        @Arg('like_type') like_type: 'like' | 'haha' | 'sad' | 'wow' | 'angry',
        @Ctx() { req }: Context,
        @PubSub() pubSub: PubSubEngine
    ): Promise<ReplyCommentPostShareMutationResponse> {
        try {
            let notify: Notify | undefined = undefined;

            const owner = await User.getMyUser(req);
            const reply_comment = await PostShareReplyComment.findOne({
                id: reply_comment_id,
            });

            if (!reply_comment) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_COMMENT_FAIL'),
                };
            }

            const existingLike = await PostShareReplyCommentLike.findOne({
                reply_comment,
                owner,
            });

            if (!existingLike) {
                const newLike = PostShareReplyCommentLike.create({
                    reply_comment,
                    owner,
                    like_type,
                });

                await newLike.save();
                const newNotify = Notify.create({
                    action: ACTIONS.EXPRESS,
                    message: ` đã bày tỏ cảm xúc về bình luận của bạn`,
                    to_id: reply_comment?.user_id,
                    post_id: reply_comment.comment.post_share_id,
                    from_id: owner.id,
                });
                notify = await newNotify.save();
                pubSub.publish(NEW_NOTI, notify);
                return {
                    code: 200,
                    success: true,
                    message: i18n.__('POST.LIKE_COMMENT_SUCCESS'),
                };
            } else {
                await PostShareReplyCommentLike.remove(existingLike);

                return {
                    code: 200,
                    success: true,
                    message: i18n.__('POST.UNLIKE_COMMENT_SUCCESS'),
                };
            }
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error);
        }
    }
}
