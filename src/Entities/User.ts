import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Post, PostComment, PostCommentLike, PostLike, PostReplyComment, PostReplyCommentLike } from '.';
import { DEFAULT_AVATAR } from '../Constants/index';

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
    @Column({ default: true })
    isActive: boolean;

    @Field()
    @Column({ default: DEFAULT_AVATAR })
    avatar: string;

    @Field(() => [Post])
    @OneToMany(() => Post, (post) => post.owner)
    posts: Post[];

    @Field(() => [PostLike])
    @OneToMany(() => PostLike, (postLike) => postLike.owner)
    likes: PostLike[];

    @Field(() => [PostComment])
    @OneToMany(() => PostComment, (post_comment) => post_comment.owner)
    comments: PostComment[];

    @Field(() => [PostCommentLike])
    @OneToMany(() => PostCommentLike, (post_comment_like) => post_comment_like.owner)
    likes_comment: PostCommentLike[];

    @Field(() => [PostReplyComment])
    @OneToMany(() => PostReplyComment, (post_reply_comment) => post_reply_comment.owner)
    reply_comments: PostReplyComment[];

    @Field(() => [PostReplyCommentLike])
    @OneToMany(() => PostReplyCommentLike, (post_reply_comment_like) => post_reply_comment_like.owner)
    reply_comment_likes: PostReplyCommentLike[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
