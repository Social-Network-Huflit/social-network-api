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
import { User } from '..';
import PostShareReplyComment from './PostShareReplyComment';

@Entity({ name: 'post_share_reply_comment_like' })
@ObjectType()
export default class PostShareReplyCommentLike extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Field(() => PostShareReplyComment)
    @ManyToOne(() => PostShareReplyComment, (reply_comment) => reply_comment.likes)
    @JoinColumn({ name: 'post_share_reply_comment_id' })
    reply_comment: PostShareReplyComment;

    @Column()
    post_share_reply_comment_id: number;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.likes_reply_comment_post_share)
    @JoinColumn({ name: 'user_id' })
    owner: User;

    @Field()
    @Column()
    like_type: string;

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
