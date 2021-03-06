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
import { PostComment, User } from '..';

@Entity({ name: 'post_comment_like' })
@ObjectType()
export default class PostCommentLike extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Field(() => PostComment)
    @ManyToOne(() => PostComment, (post_comment) => post_comment.likes)
    @JoinColumn({ name: 'comment_id' })
    comment: PostComment;

    @Column()
    comment_id: number;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.likes_comment_post)
    @JoinColumn({ name: 'user_id' })
    owner: User;

    @Column()
    user_id: number;

    @Field()
    @Column()
    like_type: 'like' | 'haha' | 'angry' | 'wow' | 'sad';

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
