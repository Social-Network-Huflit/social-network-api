import { PostComment, PostCommentLike, User } from "@Entities";
import { FieldResolver, Resolver, Root } from "type-graphql";

@Resolver(() => PostCommentLike)
export default class PostCommentLikeResolver{
    //owner
    @FieldResolver(() => User, {nullable: true})
    async owner(@Root() root: PostCommentLike): Promise<User |null | undefined>{
        return await User.findOne({
            id: root.user_id,
            active: true
        })
    }

    //comment
    @FieldResolver(() => PostComment, {nullable: true})
    async comment(@Root() root: PostCommentLike): Promise<PostComment |null | undefined>{
        return await PostComment.findOne({
            id: root.comment_id,
            active: true
        })
    }
}