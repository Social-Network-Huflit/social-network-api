import {
    PostShare,
    PostShareComment,
    PostShareCommentLike,
    PostShareReplyComment,
    User,
} from '../../Entities';
import { FieldResolver, Resolver, Root } from 'type-graphql';

@Resolver(() => PostShareComment)
export default class PostShareCommentResolver {
    //owner
    @FieldResolver(() => User, { nullable: true })
    async owner(@Root() root: PostShareComment): Promise<User | null | undefined> {
        return await User.findOne({
            id: root.user_id,
        });
    }

    //post_share
    @FieldResolver(() => PostShare, { nullable: true })
    async post_share(@Root() root: PostShareComment): Promise<PostShare | null | undefined> {
        return await PostShare.findOne({
            id: root.post_share_id,
        });
    }

    //likes
    @FieldResolver(() => [PostShareCommentLike])
    async likes(@Root() root: PostShareComment): Promise<PostShareCommentLike[]> {
        return await PostShareCommentLike.find({
            post_share_comment_id: root.id,
        });
    }

    //reply_comments
    @FieldResolver(() => [PostShareReplyComment])
    async reply_comments(@Root() root: PostShareComment): Promise<PostShareReplyComment[]> {
        return await PostShareReplyComment.find({
            post_share_comment_id: root.id,
        });
    }
}
