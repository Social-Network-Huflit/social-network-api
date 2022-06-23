import i18n from 'i18n';
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
    Post,
    PostComment,
    PostCommentLike,
    PostLike,
    PostReplyComment,
    PostReplyCommentLike,
    User,
    Notify,
} from '../../Entities';
import { Authentication } from '../../Middlewares/Auth.middleware';
import { NEW_NOTI, ACTIONS } from '../../Constants/subscriptions.constant';
import {
    CommentMutationResponse,
    Context,
    CreateCommentPostInput,
    PostMutationResponse,
    ReplyCommentMutationResponse,
    ReplyCommentPostInput,
    ServerInternal,
    UpdateCommentPostInput,
} from '../../Types';
import UpdateEntity from '../../Utils/UpdateEntity';
import ValidateInput from '../../Utils/Validation';

@Resolver()
export default class InteractPostResolver {
    //Like post
    @UseMiddleware(Authentication)
    @Mutation(() => PostMutationResponse)
    async likePost(
        @Arg('post_id', () => ID) post_id: number,
        @Arg('like_type') like_type: 'like' | 'haha' | 'wow' | 'sad' | 'angry',
        @Ctx() { req }: Context,
        @PubSub() pubSub: PubSubEngine
    ): Promise<PostMutationResponse> {
        try {
            let notify: Notify | undefined = undefined;
            const owner = await User.getMyUser(req);
            const post = await Post.findOne({
                id: post_id,
            });

            if (!post) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_POST_FAIL'),
                };
            }

            const existingLike = await PostLike.findOne({
                post_id: post.id,
                user_id: owner.id,
            });

            if (!existingLike) {
                const newLike = PostLike.create({
                    post,
                    owner,
                    like_type,
                });

                await newLike.save();
                const newNotify = Notify.create({
                    action: ACTIONS.EXPRESS,
                    message: `${owner.name} đã bày tỏ cảm xúc về bài viết của bạn`,
                    to_id: post?.user_id,
                    post_id: post.id,
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

    //Create comment Post
    @UseMiddleware(Authentication)
    @Mutation(() => CommentMutationResponse)
    async createCommentPost(
        @Arg('createCommentInput') createCommentInput: CreateCommentPostInput,
        @Ctx() { req }: Context,
        @PubSub() pubSub: PubSubEngine
    ): Promise<CommentMutationResponse> {
        try {
            const validate = await ValidateInput(req, createCommentInput);
            let notify: Notify | undefined = undefined;

            if (validate) return validate;

            const owner = await User.getMyUser(req);

            const post = await Post.findOne({
                id: createCommentInput.post_id,
            });

            if (!post) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_POST_FAIL'),
                };
            }

            const newComment = PostComment.create({
                owner,
                post,
                ...createCommentInput,
            });
            const newNotify = Notify.create({
                action: ACTIONS.COMMENT,
                message: `${owner.name} đã bình luận về bài viết của bạn`,
                to_id: post?.user_id,
                post_id: post.id,
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

    //Update Comment Post
    @UseMiddleware(Authentication)
    @Mutation(() => CommentMutationResponse)
    async updateCommentPost(
        @Arg('updateCommentInput') updateCommentInput: UpdateCommentPostInput,
        @Ctx() { req }: Context
    ): Promise<CommentMutationResponse> {
        try {
            const validate = await ValidateInput(req, updateCommentInput);

            if (validate) return validate;

            const comment = await PostComment.findOne({
                id: updateCommentInput.id,
            });

            if (!comment) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_COMMENT_FAIL'),
                };
            }

            const updatedComment = await UpdateEntity(PostComment, comment, updateCommentInput);

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

    //Delete comment post
    @UseMiddleware(Authentication)
    @Mutation(() => PostMutationResponse)
    async deleteCommentPost(
        @Arg('comment_id') comment_id: number,
        @Ctx() { req }: Context
    ): Promise<PostMutationResponse> {
        try {
            const comment = await PostComment.findOne({
                id: comment_id,
            });

            if (!comment) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_COMMENT_FAIL'),
                };
            }

            const post = await Post.findOne({
                id: comment.post_id,
            });

            if (!post) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_POST_FAIL'),
                };
            }

            if (post.user_id === req.session.userId || comment.user_id === req.session.userId) {
                //post owner && comment owner can delete
                await PostComment.softRemove(comment);

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

    //Delete reply comment post
    @UseMiddleware(Authentication)
    @Mutation(() => PostMutationResponse)
    async deleteReplyCommentPost(
        @Arg('reply_comment_id') reply_comment_id: number,
        @Ctx() { req }: Context
    ): Promise<PostMutationResponse> {
        try {
            const reply_comment = await PostReplyComment.findOne({
                id: reply_comment_id,
            });

            if (!reply_comment) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_COMMENT_FAIL'),
                };
            }

            const comment = await PostComment.findOne({
                id: reply_comment.comment_id,
            });

            if (!comment) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_COMMENT_FAIL'),
                };
            }

            const post = await Post.findOne({
                id: comment.post_id,
            });

            if (!post) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_POST_FAIL'),
                };
            }

            if (
                post.user_id === req.session.userId ||
                reply_comment.user_id === req.session.userId
            ) {
                //post owner && comment owner can delete

                await PostReplyComment.softRemove(reply_comment);

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

    //Like comment post
    @UseMiddleware(Authentication)
    @Mutation(() => PostMutationResponse)
    async likeCommentPost(
        @Arg('comment_id', () => ID) comment_id: number,
        @Arg('like_type') like_type: 'like' | 'haha' | 'angry' | 'wow' | 'sad',
        @Ctx() { req }: Context,
        @PubSub() pubSub: PubSubEngine
    ): Promise<PostMutationResponse> {
        try {
            let notify: Notify | undefined = undefined;

            const owner = await User.getMyUser(req);
            const comment = await PostComment.findOne({
                id: comment_id,
            });

            if (!comment) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_COMMENT_FAIL'),
                };
            }

            const existingLike = await PostCommentLike.findOne({
                comment,
                owner,
            });

            if (!existingLike) {
                const newLike = PostCommentLike.create({
                    comment,
                    owner,
                    like_type,
                });

                await newLike.save();
                const newNotify = Notify.create({
                    action: ACTIONS.EXPRESS,
                    message: `${owner.name} đã bày tỏ cảm xúc về bình luận của bạn`,
                    to_id: comment?.user_id,
                    post_id: comment.post_id,
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
                await PostCommentLike.remove(existingLike);

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

    //Reply comment post
    @UseMiddleware(Authentication)
    @Mutation(() => ReplyCommentMutationResponse)
    async replyCommentPost(
        @Arg('replyCommentPostInput') replyCommentPostInput: ReplyCommentPostInput,
        @Ctx() { req }: Context,
        @PubSub() pubSub: PubSubEngine
    ): Promise<ReplyCommentMutationResponse> {
        try {
            let notify: Notify | undefined = undefined;

            const validate = await ValidateInput(req, replyCommentPostInput);

            if (validate) return validate;

            const comment = await PostComment.findOne({
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

            const newReplyComment = PostReplyComment.create({
                ...replyCommentPostInput,
                owner,
                comment,
            });
            const newNotify = Notify.create({
                action: ACTIONS.COMMENT,
                message: `${owner.name} đã trả lời bình luận của bạn`,
                to_id: comment?.user_id,
                post_id: comment.post_id,
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
    @Mutation(() => PostMutationResponse)
    async likeReplyCommentPost(
        @Arg('reply_comment_id', () => ID) reply_comment_id: number,
        @Arg('like_type') like_type: 'like' | 'haha' | 'angry' | 'wow' | 'sad',
        @Ctx() { req }: Context,
        @PubSub() pubSub: PubSubEngine
    ): Promise<PostMutationResponse> {
        try {
            let notify: Notify | undefined = undefined;

            const owner = await User.getMyUser(req);
            const reply_comment = await PostReplyComment.findOne({
                id: reply_comment_id,
            });

            if (!reply_comment) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_COMMENT_FAIL'),
                };
            }

            const existingLike = await PostReplyCommentLike.findOne({
                reply_comment,
                owner,
            });

            if (!existingLike) {
                const newLike = PostReplyCommentLike.create({
                    reply_comment,
                    owner,
                    like_type,
                });

                await newLike.save();
                const newNotify = Notify.create({
                    action: ACTIONS.EXPRESS,
                    message: `${owner.name} đã bày tỏ cảm xúc về bình luận của bạn`,
                    to_id: reply_comment?.user_id,
                    post_id: reply_comment.comment.post_id,
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
                await PostReplyCommentLike.remove(existingLike);

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
