import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User, Post, PostCommentLike, PostReplyComment } from '..';

@Entity({ name: 'post_comment' })
@ObjectType()
export default class PostComment extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Field()
    @Column()
    content: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.comments_post)
    @JoinColumn({ name: 'user_id' })
    owner: User;

    @Field(() => Post)
    @ManyToOne(() => Post, (post) => post.comments)
    @JoinColumn({name: "post_id"})
    post: Post;

    @Field(() => [PostCommentLike])
    @OneToMany(() => PostCommentLike, (post_comment_like) => post_comment_like.comment)
    likes: PostCommentLike[];

    @Field(() => [PostReplyComment])
    @OneToMany(() => PostReplyComment, (post_reply_comment) => post_reply_comment.comment)
    reply_comments: PostReplyComment[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
