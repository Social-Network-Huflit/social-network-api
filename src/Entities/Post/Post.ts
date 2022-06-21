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
import { PostLike, User, PostComment, PostShare, PostAsset, CollectionDetail } from '..';

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
    youtube_link: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: 'user_id' })
    owner: User;

    @Column()
    user_id: number;

    @Field(() => [PostLike])
    @OneToMany(() => PostLike, (postLike) => postLike.post)
    likes: PostLike[];

    @Field(() => [PostComment])
    @OneToMany(() => PostComment, (post_comment) => post_comment.post)
    comments: PostComment[];

    @Field(() => [PostShare])
    @OneToMany(() => PostShare, (post_share) => post_share.post)
    shares: PostShare[];

    @Field(() => [PostAsset])
    @OneToMany(() => PostAsset, (post_asset) => post_asset.post)
    assets: PostAsset[];

    @OneToMany(() => CollectionDetail, (collection) => collection.post)
    collections: CollectionDetail[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
