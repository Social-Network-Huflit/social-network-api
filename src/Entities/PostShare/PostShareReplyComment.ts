import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { PostShareComment, PostShareReplyCommentLike, User } from '@Entities';

@Entity({ name: 'post_share_reply_comment' })
@ObjectType()
export default class PostShareReplyComment extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Field()
    @Column()
    content: string;

    @Field(() => PostShareComment)
    @ManyToOne(() => PostShareComment, (post_share_comment) => post_share_comment.reply_comments)
    @JoinColumn({ name: 'post_share_comment_id' })
    comment: PostShareComment;

    @Column()
    post_share_comment_id: number;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.reply_comments_post_share)
    @JoinColumn({ name: 'user_id' })
    owner: User;

    @Column()
    user_id: number;

    @Field(() => [PostShareReplyCommentLike])
    @OneToMany(() => PostShareReplyCommentLike, (like) => like.reply_comment)
    likes: PostShareReplyCommentLike[];

    @Field()
    @Column({ default: true })
    active: boolean;

    @CreateDateColumn()
    @Field()
    createdAt: Date;

    @UpdateDateColumn()
    @Field()
    updatedAt: Date;
}
