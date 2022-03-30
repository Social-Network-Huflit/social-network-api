import { Logger } from '@Configs';
import { Post, PostComment, PostLike, PostShare, User } from '@Entities';
import { POST } from '@Language';
import { Authentication } from '@Middlewares/Auth.middleware';
import {
    Context,
    CreatePostInput,
    PostMutationResponse,
    ServerInternal,
    UpdatePostInput,
} from '@Types';
import UpdateEntity from '@Utils/UpdateEntity';
import ValidateInput from '@Utils/Validation';
import { Arg, Ctx, FieldResolver, Mutation, Resolver, Root, UseMiddleware } from 'type-graphql';

@Resolver(() => Post)
export default class PostResolver {
    //owner
    @FieldResolver(() => User, { nullable: true })
    async owner(@Root() root: Post) {
        return await User.findOne({
            id: root.user_id,
        });
    }

    //likes
    @FieldResolver(() => [PostLike])
    async likes(@Root() root: Post): Promise<PostLike[]> {
        return await PostLike.find({
            post_id: root.id,
        });
    }

    //comments
    @FieldResolver(() => [PostComment])
    async comments(@Root() root: Post): Promise<PostComment[]> {
        return await PostComment.find({
            post_id: root.id,
        });
    }

    //shares
    @FieldResolver(() => [PostShare])
    async shares(@Root() root: Post): Promise<PostShare[]> {
        return await PostShare.find({
            post_id: root.id,
        });
    }

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
                message: POST.CREATE_POST_SUCCESS,
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
            });

            if (!post) {
                return {
                    code: 400,
                    success: false,
                    message: POST.FIND_POST_FAIL,
                };
            }

            const updatedPost = await UpdateEntity(Post, post, updatePostInput);

            return {
                code: 200,
                success: true,
                message: POST.UPDATE_POST_SUCCESS,
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
            });

            if (!post) {
                return {
                    code: 400,
                    success: false,
                    message: POST.FIND_POST_FAIL,
                };
            }

            await Post.softRemove(post);

            return {
                code: 200,
                success: true,
                message: POST.DELETE_POST_SUCCESS,
            };
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error.message);
        }
    }
}
