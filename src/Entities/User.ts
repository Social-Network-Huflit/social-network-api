import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Post, PostLike } from '.';
import { DEFAULT_AVATAR } from '../Constants/index';

@ObjectType()
@Entity()
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field((_return) => ID)
    id: number;

    @Field()
    @Column()
    username: string;

    @Field()
    @Column()
    email: string;

    @Field()
    @Column()
    name: string;

    @Column()
    password: string;

    @Field()
    @Column()
    phoneNumber: string;

    @Field()
    @Column({ default: true })
    isActive: boolean;

    @Field()
    @Column({ default: DEFAULT_AVATAR })
    avatar: string;

    @Field(() => [Post])
    @OneToMany(() => Post, (post) => post.owner)
    posts: Post[];

    @Field(() => [PostLike])
    @OneToMany(() => PostLike, (postLike) => postLike.user)
    likes: PostLike[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
