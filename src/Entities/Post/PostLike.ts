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

    @ManyToOne(() => User, (user) => user.likes)
    @Field(() => User)
    @JoinColumn({ name: 'user_id' })
    owner: User;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
