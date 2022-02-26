import { Logger } from '@Configs';
import { Post, User } from '@Entities';
import { Authentication } from '@Middlewares/Auth.middleware';
import {
    Context,
    CreatePostInput,
    UpdatePostInput,
    PostMutationResponse,
    ServerInternal,
} from '@Types';
import ValidateInput from '@Utils/Validation';
import i18n from 'i18n';
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql';
import _ from 'lodash';

@Resolver(() => Post)
export default class PostResolver {
    //Create Post
    @UseMiddleware(Authentication)
    @Mutation(() => PostMutationResponse)
    async createPost(
        @Arg('createPostInput') createPostInput: CreatePostInput,
        @Ctx() { req }: Context
    ): Promise<PostMutationResponse> {
        try {
            const validate = await ValidateInput(req, createPostInput);

            if (validate) return validate;

            const owner = await User.getMyUser(req);

            const newPost = Post.create({
                ...createPostInput,
                owner,
            });

            return {
                code: 200,
                success: true,
                message: i18n.__('POST.CREATE_POST_SUCCESS'),
                result: await newPost.save(),
            };
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error.message);
        }
    }

    //Update Post
    @UseMiddleware(Authentication)
    @Mutation(() => PostMutationResponse)
    async updatePost(
        @Arg('updatePostInput') updatePostInput: UpdatePostInput,
        @Ctx() { req }: Context
    ): Promise<PostMutationResponse> {
        try {
            const validate = await ValidateInput(req, updatePostInput);

            if (validate) return validate;

            const owner = await User.getMyUser(req);

            const post = await Post.findOne({
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

            await Post.update(
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
    @Mutation(() => PostMutationResponse)
    async deletePost(
        @Arg('post_id') id: number,
        @Ctx() { req }: Context
    ): Promise<PostMutationResponse> {
        try {
            const owner = await User.getMyUser(req);

            const post = await Post.findOne({
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

            await Post.update(
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
