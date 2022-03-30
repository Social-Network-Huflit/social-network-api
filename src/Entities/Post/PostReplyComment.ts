import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { PostComment, PostReplyCommentLike, User } from '@Entities';

@Entity({ name: 'post_reply_comment' })
@ObjectType()
export default class PostReplyComment extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Field()
    @Column()
    content: string;

    @Field(() => PostComment)
    @ManyToOne(() => PostComment, (post_comment) => post_comment.reply_comments)
    @JoinColumn({ name: 'comment_id' })
    comment: PostComment;

    @Column()
    comment_id: number;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.reply_comments_post)
    @JoinColumn({ name: 'user_id' })
    owner: User;

    @Column()
    user_id: number;

    @Field(() => [PostReplyCommentLike])
    @OneToMany(
        () => PostReplyCommentLike,
        (post_reply_comment_like) => post_reply_comment_like.reply_comment
    )
    likes: PostReplyCommentLike[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
