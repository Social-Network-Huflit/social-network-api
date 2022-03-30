import { PostShareReplyComment, PostShareReplyCommentLike, User } from "@Entities";
import { FieldResolver, Resolver, Root } from "type-graphql";

@Resolver(() => PostShareReplyCommentLike)
export default class PostShareReplyCommentLikeResolver{
    //owner
    @FieldResolver(() => User, {nullable: true})
    async owner(@Root() root: PostShareReplyCommentLike): Promise<User | undefined | null>{
        return await User.findOne({
            id: root.user_id,
        })
    }

    //reply_comment
    @FieldResolver(() => PostShareReplyComment, {nullable: true})
    async reply_comment(@Root() root: PostShareReplyCommentLike): Promise<PostShareReplyComment | undefined | null>{
        return await PostShareReplyComment.findOne({
            id: root.post_share_reply_comment_id,
        })
    }
}