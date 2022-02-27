import { Logger } from "@Configs";
import { PostShare, User } from "@Entities";
import { Authentication } from "@Middlewares/Auth.middleware";
import { Context, CreatePostShareInput, PostShareMutationResponse, ServerInternal, UpdatePostShareInput } from "@Types";
import ValidateInput from "@Utils/Validation";
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import _ from 'lodash'

@Resolver()
export default class PostShareResolver{
    //Create Post Share
    @UseMiddleware(Authentication)
    @Mutation(() => PostShareMutationResponse)
    async createPost(
        @Arg('createPostInput') createPostInput: CreatePostShareInput,
        @Ctx() { req }: Context
    ): Promise<PostShareMutationResponse> {
        try {
            const validate = await ValidateInput(req, createPostInput);

            if (validate) return validate;

            const owner = await User.getMyUser(req);

            const newPostShare = PostShare.create({
                ...createPostInput,
                owner,
            });

            return {
                code: 200,
                success: true,
                message: i18n.__('POST_SHARE.CREATE_POST_SHARE_SUCCESS'),
                result: await newPostShare.save(),
            };
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error.message);
        }
    }

    //Update Post Share
    @UseMiddleware(Authentication)
    @Mutation(() => PostShareMutationResponse)
    async updatePost(
        @Arg('updatePostInput') updatePostInput: UpdatePostShareInput,
        @Ctx() { req }: Context
    ): Promise<PostShareMutationResponse> {
        try {
            const validate = await ValidateInput(req, updatePostInput);

            if (validate) return validate;

            const owner = await User.getMyUser(req);

            const post = await PostShare.findOne({
                id: updatePostInput.id,
                owner,
                active: true
            });

            if (!post) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_POST_FAIL'),
                };
            }

            const updatedPost = _.extend(post, updatePostInput);

            await PostShare.update(
                {
                    id: updatePostInput.id,
                    owner,
                    active: true
                },
                {
                    ...updatedPost,
                }
            );

            return {
                code: 200,
                success: true,
                message: i18n.__('POST.UPDATE_POST_SUCCESS'),
                result: updatedPost,
            };
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error.message);
        }
    }

    //Delete Post
    @UseMiddleware(Authentication)
    @Mutation(() => PostShareMutationResponse)
    async deletePost(
        @Arg('post_share_id') id: number,
        @Ctx() { req }: Context
    ): Promise<PostShareMutationResponse> {
        try {
            const owner = await User.getMyUser(req);

            const post = await PostShare.findOne({
                id,
                owner,
                active: true
            });

            if (!post) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_POST_FAIL'),
                };
            }

            _.extend(post, {
                active: false
            });

            await PostShare.update(
                {
                    id,
                    owner,
                    active: true
                },
                {
                    active: false
                }
            );

            return {
                code: 200,
                success: true,
                message: i18n.__('POST.DELETE_POST_SUCCESS'),
            };
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error.message);
        }
    }
}