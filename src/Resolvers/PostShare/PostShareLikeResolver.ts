import { PostShare, PostShareLike, User } from "@Entities";
import { FieldResolver, Resolver, Root } from "type-graphql";

@Resolver(() => PostShareLike)
export default class PostShareLikeResolver{
    //owner
    @FieldResolver(() => User, {nullable: true})
    async owner(@Root() root: PostShareLike): Promise<User | undefined | null>{
        return await User.findOne({
            id: root.user_id,
            active: true
        })
    }

    //post_share
    @FieldResolver(() => PostShare, {nullable: true})
    async post_share(@Root() root: PostShareLike): Promise<PostShare | undefined | null>{
        return await PostShare.findOne({
            id: root.post_share_id,
            active: true
        })
    }
}