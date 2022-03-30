import { PostShareComment, PostShareCommentLike, User } from "@Entities";
import { FieldResolver, Resolver, Root } from "type-graphql";

@Resolver(() => PostShareCommentLike)
export default class PostShareCommentLikeResolver{
    //owner
    @FieldResolver(() => User, {nullable: true})
    async owner(@Root() root: PostShareCommentLike): Promise<User | undefined | null>{
        return await User.findOne({
            id: root.user_id,
        })
    }

    //comment
    @FieldResolver(() => PostShareComment, {nullable: true})
    async comment(@Root() root: PostShareCommentLike): Promise<PostShareComment | undefined | null>{
        return await PostShareComment.findOne({
            id: root.post_share_comment_id,
        })
    }
}