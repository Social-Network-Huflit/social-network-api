import { Post, User } from '@Entities';
import { FieldResolver, Resolver, Root } from 'type-graphql';
import PostLike from '../../Entities/Post/PostLike';

@Resolver(() => PostLike)
export default class PostLikeResolver {
    //post
    @FieldResolver(() => Post, {nullable: true})
    async post(@Root() root: PostLike): Promise<Post | null | undefined> {
        return await Post.findOne({
            id: root.post_id,
            active: true,
        });
    }

    //owner
    @FieldResolver(() => User, {nullable: true})
    async owner(@Root() root: PostLike): Promise<User | null | undefined> {
        return await User.findOne({
            id: root.user_id,
            active: true,
        });
    }
}
