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
import { Post, PostShareComment, PostShareLike, User } from '@Entities';

@Entity({ name: 'post_share' })
@ObjectType()
export default class PostShare extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    caption?: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.posts_share)
    @JoinColumn({ name: 'user_id' })
    owner: User;

    @Column()
    user_id: number;

    @Field(() => Post)
    @ManyToOne(() => Post, (post) => post.shares)
    @JoinColumn({ name: 'post_id' })
    post: Post;

    @Column()
    post_id: number;

    @Field(() => [PostShareComment])
    @OneToMany(() => PostShareComment, (post_share_comment) => post_share_comment.post_share)
    comments: PostShareComment[];

    @Field(() => [PostShareLike])
    @OneToMany(() => PostShareLike, (likes) => likes.post_share)
    likes: PostShareLike[];

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
