import {
    PostShare,
    PostShareComment,
    PostShareCommentLike,
    PostShareReplyComment,
    User,
} from '../../Entities';
import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql';
import { Context } from '../../Types';
import moment from 'moment';

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

    //like_count
    @FieldResolver(() => Number)
    async like_count(@Root() root: PostShareComment): Promise<number>{
        return (await this.likes(root)).length;
    }

    //like_type
    @FieldResolver(() => Boolean)
    async liked(@Root() root: PostShareComment, @Ctx() {req}: Context): Promise<boolean>{
        const user = await User.getMyUser(req);

        const existingLike = await PostShareCommentLike.findOne({
            user_id: user.id,
            post_share_comment_id: root.id
        });

        if (existingLike){
            return true;
        }

        return false;
    }

    @FieldResolver(() => String, {nullable: true})
    async like_type(@Root() root: PostShareComment, @Ctx() {req}: Context): Promise<"haha" | "like" | "wow" | "sad" | "angry" | null | undefined>{
        const user = await User.getMyUser(req);

        const existingLike = await PostShareCommentLike.findOne({
            user_id: user.id,
            post_share_comment_id: root.id
        });

        if (existingLike){
            return existingLike.like_type;
        }

        return null;
    }

    //reply_comments
    @FieldResolver(() => [PostShareReplyComment])
    async reply_comments(@Root() root: PostShareComment): Promise<PostShareReplyComment[]> {
        return await PostShareReplyComment.find({
            post_share_comment_id: root.id,
        });
    }

    @FieldResolver(() => String)
    timestamp(@Root() root: PostShareComment): string{
        return moment(root.createdAt).fromNow();
    }
}
