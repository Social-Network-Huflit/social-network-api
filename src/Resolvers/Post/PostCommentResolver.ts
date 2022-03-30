import { Post, PostComment, PostCommentLike, PostReplyComment, User } from "@Entities";
import { FieldResolver, Resolver, Root } from "type-graphql";

@Resolver(() => PostComment)
export default class PostCommentResolver{
    //owner
    @FieldResolver(() => User, {nullable: true})
    async owner(@Root() root: PostComment): Promise<User | null | undefined>{
        return await User.findOne({
            id: root.user_id,
        })
    }

    //post
    @FieldResolver(() => Post, {nullable: true})
    async post(@Root() root: PostComment): Promise<Post | null | undefined>{
        return await Post.findOne({
            id: root.post_id,
        })
    }

    //likes
    @FieldResolver(() => [PostCommentLike])
    async likes(@Root() root: PostComment): Promise<PostCommentLike[]>{
        return await PostCommentLike.find({
            comment_id: root.id
        })
    }

    //reply_comments
    @FieldResolver(() => [PostReplyComment])
    async reply_comments(@Root() root: PostComment): Promise<PostReplyComment[]>{
        return await PostReplyComment.find({
            comment_id: root.id,
        })
    }
}