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
import { PostShare, User } from '..';

@Entity({ name: 'post_share_like' })
@ObjectType()
export default class PostShareLike extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Field(() => PostShare)
    @ManyToOne(() => PostShare, (post_share) => post_share.likes)
    @JoinColumn({ name: 'post_share_id' })
    post_share: PostShare;

    @Column()
    post_share_id: number;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.likes_post_share)
    @JoinColumn({ name: 'user_id' })
    owner: User;

    @Field(() => String)
    @Column()
    like_type: "like" | "haha" | "sad" | "wow" | "angry";

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
