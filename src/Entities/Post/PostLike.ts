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
import { Post, User } from '..';

@Entity({ name: 'post_like' })
@ObjectType()
export default class PostLike extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Post, (post) => post.likes)
    @Field(() => Post)
    @JoinColumn({ name: 'post_id' })
    post: Post;

    @Column()
    post_id: number;

    @ManyToOne(() => User, (user) => user.likes_post)
    @Field(() => User)
    @JoinColumn({ name: 'user_id' })
    owner: User;

    @Column()
    user_id: number;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
