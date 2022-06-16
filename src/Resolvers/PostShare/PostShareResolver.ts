import {
    Arg,
    Ctx,
    FieldResolver,
    ID,
    Mutation,
    Query,
    Resolver,
    Root,
    UseMiddleware,
} from 'type-graphql';
import { Logger } from '../../Configs';
import { Post, PostShare, PostShareComment, PostShareLike, User } from '../../Entities';
import { Authentication } from '../../Middlewares/Auth.middleware';
import {
    Context,
    CreatePostShareInput,
    PostShareMutationResponse,
    ServerInternal,
    UpdatePostShareInput,
} from '../../Types';
import UpdateEntity from '../../Utils/UpdateEntity';
import ValidateInput from '../../Utils/Validation';
import i18n from 'i18n';
import moment from 'moment';

@Resolver(() => PostShare)
export default class PostShareResolver {
    //post_type
    @FieldResolver(() => String)
    post_type() {
        return 'post_share';
    }

    //post
    @FieldResolver(() => Post, { nullable: true })
    async post(@Root() post_share: PostShare): Promise<Post | null | undefined> {
        const post = await Post.findOne(post_share.post_id);

        return post;
    }

    //owner
    @FieldResolver(() => User, { nullable: true })
    async owner(@Root() root: PostShare): Promise<User | null | undefined> {
        return await User.findOne({
            id: root.user_id,
        });
    }

    //comments
    @FieldResolver(() => [PostShareComment])
    async comments(@Root() root: PostShare): Promise<PostShareComment[]> {
        return await PostShareComment.find({
            where: { post_share_id: root.id },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    @FieldResolver(() => Number)
    async comment_count(@Root() root: PostShare): Promise<number> {
        return (await this.comments(root)).length;
    }

    //likes
    @FieldResolver(() => [PostShareLike])
    async likes(@Root() root: PostShare): Promise<PostShareLike[]> {
        return await PostShareLike.find({
            where: { post_share_id: root.id },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    //liked
    @FieldResolver(() => Boolean)
    async liked(@Root() root: PostShare, @Ctx() { req }: Context): Promise<boolean> {
        const user = await User.getMyUser(req);

        const like = await PostShareLike.findOne({
            user_id: user.id,
            post_share_id: root.id,
        });

        return like !== undefined;
    }

    //like_type
    @FieldResolver(() => String, { nullable: true })
    async like_type(
        @Root() root: PostShare,
        @Ctx() { req }: Context
    ): Promise<string | null | undefined> {
        const user = await User.getMyUser(req);

        const like = await PostShareLike.findOne({
            user_id: user.id,
            post_share_id: root.id,
        });

        if (like !== undefined) {
            return like.like_type;
        }

        return undefined;
    }

    //like_count
    @FieldResolver(() => Number)
    async like_count(@Root() root: PostShare): Promise<number> {
        return (await this.likes(root)).length;
    }

    //timestamp
    @FieldResolver(() => String)
    timestamp(@Root() post: Post): string {
        return moment(post.createdAt).fromNow();
    }

    //Create Post Share
    @UseMiddleware(Authentication)
    @Mutation(() => PostShareMutationResponse)
    async createPostShare(
        @Arg('createPostInput') createPostInput: CreatePostShareInput,
        @Ctx() { req }: Context
    ): Promise<PostShareMutationResponse> {
        try {
            const validate = await ValidateInput(req, createPostInput);

            if (validate) return validate;

            const owner = await User.getMyUser(req);

            const post = await Post.findOne({
                id: createPostInput.post_id,
            });

            if (!post) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_POST_FAIL'),
                };
            }

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
    async updatePostShare(
        @Arg('updatePostShareInput') updatePostShareInput: UpdatePostShareInput,
        @Ctx() { req }: Context
    ): Promise<PostShareMutationResponse> {
        try {
            const validate = await ValidateInput(req, updatePostShareInput);

            if (validate) return validate;

            const owner = await User.getMyUser(req);

            const post = await PostShare.findOne({
                id: updatePostShareInput.id,
                owner,
            });

            if (!post) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_POST_FAIL'),
                };
            }

            const updatedPost = await UpdateEntity(PostShare, post, updatePostShareInput);

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

    //Delete Post Share
    @UseMiddleware(Authentication)
    @Mutation(() => PostShareMutationResponse)
    async deletePostShare(
        @Arg('post_share_id') id: number,
        @Ctx() { req }: Context
    ): Promise<PostShareMutationResponse> {
        try {
            const owner = await User.getMyUser(req);

            const post = await PostShare.findOne({
                id,
                owner,
            });

            if (!post) {
                return {
                    code: 400,
                    success: false,
                    message: i18n.__('POST.FIND_POST_FAIL'),
                };
            }

            await PostShare.softRemove(post);

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

    //Get Post Share
    @Query(() => PostShare, { nullable: true })
    async getPostShare(
        @Arg('post_id', () => ID) post_id: number
    ): Promise<PostShare | null | undefined> {
        return await PostShare.findOne(post_id);
    }
}
