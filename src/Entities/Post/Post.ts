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
import { PostLike, User, PostComment } from '..';

@Entity({ name: 'post' })
@ObjectType()
export default class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Field({ nullable: true })
    @Column({ nullable: true })
    caption: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    image_link: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    video_link: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    youtube_link: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: 'user_id' })
    owner: User;

    @Field(() => [PostLike])
    @OneToMany(() => PostLike, (postLike) => postLike.post)
    likes: PostLike[];

    @Field(() => [PostComment])
    @OneToMany(() => PostComment, (post_comment) => post_comment.post)
    comments: PostComment[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
