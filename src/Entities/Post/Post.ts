import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { PostLike, User } from '..';

@Entity()
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
    owner: User;

    @Field(() => [PostLike])
    @OneToMany(() => PostLike, (postLike) => postLike.post)
    likes: PostLike[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
