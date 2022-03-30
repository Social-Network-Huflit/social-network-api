import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {
    Follow,
    Post,
    PostComment,
    PostCommentLike,
    PostLike,
    PostReplyComment,
    PostReplyCommentLike,
    PostShare,
    PostShareComment,
    PostShareCommentLike,
    PostShareLike,
    PostShareReplyComment,
    PostShareReplyCommentLike,
} from '@Entities';
import { DEFAULT_AVATAR } from '@Constants/index';
import { Request } from '@Types';
import { AuthenticationError } from 'apollo-server-core';
import i18n from 'i18n';

@ObjectType()
@Entity({ name: 'user' })
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field((_return) => ID)
    id: number;

    @Field()
    @Column()
    username: string;

    @Field()
    @Column()
    email: string;

    @Field()
    @Column()
    name: string;

    @Column()
    password: string;

    @Field()
    @Column()
    phoneNumber: string;

    @Field()
    @Column({ default: DEFAULT_AVATAR })
    avatar: string;

    @Field(() => [Post])
    @OneToMany(() => Post, (post) => post.owner)
    posts: Post[];

    @Field(() => [PostLike])
    @OneToMany(() => PostLike, (postLike) => postLike.owner)
    likes_post: PostLike[];

    @Field(() => [PostComment])
    @OneToMany(() => PostComment, (post_comment) => post_comment.owner)
    comments_post: PostComment[];

    @Field(() => [PostCommentLike])
    @OneToMany(() => PostCommentLike, (post_comment_like) => post_comment_like.owner)
    likes_comment_post: PostCommentLike[];

    @Field(() => [PostReplyComment])
    @OneToMany(() => PostReplyComment, (post_reply_comment) => post_reply_comment.owner)
    reply_comments_post: PostReplyComment[];

    @Field(() => [PostReplyCommentLike])
    @OneToMany(
        () => PostReplyCommentLike,
        (post_reply_comment_like) => post_reply_comment_like.owner
    )
    likes_reply_comment_post: PostReplyCommentLike[];

    @Field(() => [PostShare])
    @OneToMany(() => PostShare, (post_share) => post_share.owner)
    posts_share: PostShare[];

    @Field(() => [PostShareComment])
    @OneToMany(() => PostShareComment, (post_share_comment) => post_share_comment.owner)
    comments_post_share: PostShareComment[];

    @Field(() => [PostShareCommentLike])
    @OneToMany(() => PostShareCommentLike, (like) => like.owner)
    likes_comment_post_share: PostShareCommentLike[];

    @Field(() => [PostShareLike])
    @OneToMany(() => PostShareLike, (like) => like.owner)
    likes_post_share: PostShareLike[];

    @Field(() => [PostShareReplyComment])
    @OneToMany(() => PostShareReplyComment, (comment) => comment.owner)
    reply_comments_post_share: PostShareReplyComment[];

    @Field(() => [PostShareReplyCommentLike])
    @OneToMany(() => PostShareReplyCommentLike, (like) => like.owner)
    likes_reply_comment_post_share: PostShareReplyCommentLike[];

    @Field(() => [User])
    @OneToMany(() => Follow, (follow) => follow.followers)
    following: User[];

    @Field(() => [User])
    @OneToMany(() => Follow, (follow) => follow.following)
    followers: User[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    public static async getMyUser(req: Request): Promise<User> {
        const user = await User.findOne({
            id: req.session.userId,
        });

        if (!user) {
            throw new AuthenticationError(i18n.__('AUTH.FIND_USER_FAIL'));
        }

        return user;
    }
}