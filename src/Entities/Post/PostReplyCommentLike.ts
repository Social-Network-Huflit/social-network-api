import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    CreateDateColumn,
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

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.reply_comment_likes)
    @JoinColumn({ name: 'user_id' })
    owner: User;

    @CreateDateColumn()
    @Field()
    createdAt: Date;

    @UpdateDateColumn()
    @Field()
    updatedAt: Date;
}
