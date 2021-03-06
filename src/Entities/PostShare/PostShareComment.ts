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
import { PostShare, PostShareCommentLike, PostShareReplyComment, User } from '..';

@Entity({ name: 'post_share_comment' })
@ObjectType()
export default class PostShareComment extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Field()
    @Column()
    content: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.comments_post_share)
    @JoinColumn({ name: 'user_id' })
    owner: User;

    @Column()
    user_id: number;

    @Field(() => PostShare)
    @ManyToOne(() => PostShare, (post_share) => post_share.comments)
    @JoinColumn({ name: 'post_share_id' })
    post_share: PostShare;

    @Column()
    post_share_id: number;

    @Field(() => [PostShareCommentLike])
    @OneToMany(() => PostShareCommentLike, (like) => like.comment)
    likes: PostShareCommentLike[];

    @Field(() => [PostShareReplyComment])
    @OneToMany(() => PostShareReplyComment, (comment) => comment.comment)
    reply_comments: PostShareReplyComment[];

    @CreateDateColumn()
    @Field()
    createdAt: Date;

    @UpdateDateColumn()
    @Field()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
