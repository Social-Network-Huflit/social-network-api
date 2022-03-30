import { PostShareComment, PostShareReplyComment, PostShareReplyCommentLike, User } from "@Entities";
import { FieldResolver, Resolver, Root } from "type-graphql";

@Resolver(() => PostShareReplyComment)
export default class PostShareReplyCommentResolver{
    //owner
    @FieldResolver(() => User, {nullable: true})
    async owner(@Root() root: PostShareReplyComment): Promise<User | undefined | null>{
        return await User.findOne({
            id: root.user_id,
        })
    }

    //comment
    @FieldResolver(() => PostShareComment, {nullable: true})
    async comment(@Root() root: PostShareReplyComment): Promise<PostShareComment | undefined | null>{
        return await PostShareComment.findOne({
            id: root.post_share_comment_id,
        })
    }

    //likes
    @FieldResolver(() => [PostShareReplyCommentLike])
    async likes(@Root() root: PostShareReplyComment): Promise<PostShareReplyCommentLike[]>{
        return await PostShareReplyCommentLike.find({
            post_share_reply_comment_id: root.id
        })
    }
}