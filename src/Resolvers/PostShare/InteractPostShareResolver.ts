import { Logger } from '@Configs';
import {
    PostShare,
    PostShareComment,
    PostShareCommentLike,
    PostShareLike,
    PostShareReplyComment,
    PostShareReplyCommentLike,
    User
} from '@Entities';
import { POST } from '@Language';
import { Authentication } from '@Middlewares/Auth.middleware';
import {
    CommentPostShareMutationResponse,
    Context,
    CreateCommentPostShareInput, IMutationResponse,
    ReplyCommentPostShareInput,
    ReplyCommentPostShareMutationResponse,
    ServerInternal,
    UpdateCommentPostShareInput
} from '@Types';
import ValidateInput from '@Utils/Validation';
import _ from 'lodash';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';

@Resolver()
export default class InteractPostShareResolver {
    //Like post share
    @UseMiddleware(Authentication)
    @Mutation(() => IMutationResponse)
    async likePostShare(
        @Arg('post_share_id') post_share_id: number,
        @Ctx() { req }: Context
    ): Promise<IMutationResponse> {
        try {
            const owner = await User.getMyUser(req);
            const post_share = await PostShare.findOne({
                id: post_share_id,
                active: true,
            });

            if (!post_share) {
                return {
                    code: 400,
                    success: false,
                    message: POST.FIND_POST_FAIL,
                };
            }

            const existingLike = await PostShareLike.findOne({
                post_share,
                owner,
            });

            if (!existingLike) {
                const newLike = PostShareLike.create({
                    post_share,
                    owner,
                });

                await newLike.save();

                return {
                    code: 200,
                    success: true,
                    message: POST.LIKE_POST_SUCCESS,
                };
            } else {
                await PostShareLike.remove(existingLike);

                return {
                    code: 200,
                    success: true,
                    message: POST.UNLIKE_POST_SUCCESS,
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
        @Ctx() { req }: Context
    ): Promise<CommentPostShareMutationResponse> {
        try {
            const validate = await ValidateInput(req, createCommentInput);

            if (validate) return validate;

            const owner = await User.getMyUser(req);

            const post_share = await PostShare.findOne({
                id: createCommentInput.post_share_id,
                active: true,
            });

            if (!post_share) {
                return {
                    code: 400,
                    success: false,
                    message: POST.FIND_POST_FAIL,
                };
            }

            const newComment = PostShareComment.create({
                owner,
                post_share,
                ...createCommentInput,
            });

            return {
                code: 201,
                success: true,
                message: POST.COMMENT_POST_SUCCESS,
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
                active: true,
            });

            if (!comment) {
                return {
                    code: 400,
                    success: false,
                    message: POST.FIND_COMMENT_FAIL,
                };
            }

            const updatedComment = _.extend(comment, updateCommentInput);

            await PostShareComment.update(
                {
                    id: updateCommentInput.id,
                    active: true,
                },
                updatedComment
            );

            return {
                code: 200,
                success: true,
                message: POST.UPDATE_COMMENT_SUCCESS,
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
                active: true,
            });

            if (!comment) {
                return {
                    code: 400,
                    success: false,
                    message: POST.FIND_COMMENT_FAIL,
                };
            }

            const post_share = await PostShare.findOne({
                id: comment.post_share_id,
                active: true,
            });

            if (!post_share) {
                return {
                    code: 400,
                    success: false,
                    message: POST.FIND_POST_FAIL,
                };
            }

            if (
                post_share.user_id === req.session.userId ||
                comment.user_id === req.session.userId
            ) {
                //post owner && comment owner can delete
                _.extend(comment, {
                    active: false,
                });

                await PostShareComment.update(
                    {
                        id: comment_id,
                        active: true,
                    },
                    {
                        active: false,
                    }
                );

                return {
                    code: 200,
                    success: true,
                    message: POST.DELETE_COMMENT_POST_SUCCESS,
                };
            } else {
                return {
                    code: 401,
                    success: false,
                    message: POST.DELETE_COMMENT_POST_FAIL,
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
                active: true,
            });

            if (!reply_comment) {
                return {
                    code: 400,
                    success: false,
                    message: POST.FIND_COMMENT_FAIL,
                };
            }

            const comment = await PostShareComment.findOne({
                id: reply_comment.post_share_comment_id,
                active: true
            })

            if (!comment) {
                return {
                    code: 400,
                    success: false,
                    message: POST.FIND_COMMENT_FAIL,
                };
            }

            const post_share = await PostShare.findOne({
                id: comment.post_share_id,
                active: true,
            });

            if (!post_share) {
                return {
                    code: 400,
                    success: false,
                    message: POST.FIND_POST_FAIL,
                };
            }

            if (
                post_share.user_id === req.session.userId ||
                reply_comment.user_id === req.session.userId
            ) {
                //post owner && comment owner can delete
                _.extend(reply_comment, {
                    active: false,
                });

                await PostShareReplyComment.update(
                    {
                        id: reply_comment_id,
                        active: true,
                    },
                    {
                        active: false,
                    }
                );

                return {
                    code: 200,
                    success: true,
                    message: POST.DELETE_COMMENT_POST_SUCCESS,
                };
            } else {
                return {
                    code: 401,
                    success: false,
                    message: POST.DELETE_COMMENT_POST_FAIL,
                };
            }
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error.message);
        }
    }

    //Like comment post share
    @UseMiddleware(Authentication)
    @Mutation(() => IMutationResponse)
    async likeCommentPostShare(
        @Arg('comment_id') comment_id: number,
        @Ctx() { req }: Context
    ): Promise<IMutationResponse> {
        try {
            const owner = await User.getMyUser(req);
            const comment = await PostShareComment.findOne({
                id: comment_id,
                active: true,
            });

            if (!comment) {
                return {
                    code: 400,
                    success: false,
                    message: POST.FIND_COMMENT_FAIL,
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
                });

                await newLike.save();

                return {
                    code: 200,
                    success: true,
                    message: POST.LIKE_COMMENT_SUCCESS,
                };
            } else {
                await PostShareCommentLike.remove(existingLike);

                return {
                    code: 200,
                    success: true,
                    message: POST.UNLIKE_COMMENT_SUCCESS,
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
        @Ctx() { req }: Context
    ): Promise<ReplyCommentPostShareMutationResponse> {
        try {
            const validate = await ValidateInput(req, replyCommentPostInput);

            if (validate) return validate;

            const comment = await PostShareComment.findOne({
                id: replyCommentPostInput.comment_id,
                active: true,
            });

            if (!comment) {
                return {
                    code: 400,
                    success: false,
                    message: POST.FIND_COMMENT_FAIL,
                };
            }

            const owner = await User.getMyUser(req);

            const newReplyComment = PostShareReplyComment.create({
                ...replyCommentPostInput,
                owner,
                comment,
            });

            return {
                code: 201,
                success: true,
                message: POST.REPLY_COMMENT_SUCCESS,
                result: await newReplyComment.save(),
            };
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error.message);
        }
    }

    //Like reply comment post
    @UseMiddleware(Authentication)
    @Mutation(() => IMutationResponse)
    async likeReplyCommentPostShare(
        @Arg('reply_comment_id') reply_comment_id: number,
        @Ctx() { req }: Context
    ): Promise<IMutationResponse> {
        try {
            const owner = await User.getMyUser(req);
            const reply_comment = await PostShareReplyComment.findOne({
                id: reply_comment_id,
                active: true,
            });

            if (!reply_comment) {
                return {
                    code: 400,
                    success: false,
                    message: POST.FIND_COMMENT_FAIL,
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
                });

                await newLike.save();

                return {
                    code: 200,
                    success: true,
                    message: POST.LIKE_COMMENT_SUCCESS,
                };
            } else {
                await PostShareReplyCommentLike.remove(existingLike);

                return {
                    code: 200,
                    success: true,
                    message: POST.UNLIKE_COMMENT_SUCCESS,
                };
            }
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error);
        }
    }
}
