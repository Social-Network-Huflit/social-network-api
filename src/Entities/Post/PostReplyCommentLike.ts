import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { PostReplyComment, User } from '..';

@Entity({ name: 'post_reply_comment_like' })
@ObjectType()
export default class PostReplyCommentLike extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Field(() => PostReplyComment)
    @ManyToOne(() => PostReplyComment, (post_reply_comment) => post_reply_comment.likes)
    @JoinColumn({ name: 'reply_comment_id' })
    reply_comment: PostReplyComment;

    @Column()
    reply_comment_id: number;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.likes_reply_comment_post)
    @JoinColumn({ name: 'user_id' })
    owner: User;

    @Column()
    user_id: number;

    @CreateDateColumn()
    @Field()
    createdAt: Date;

    @UpdateDateColumn()
    @Field()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
