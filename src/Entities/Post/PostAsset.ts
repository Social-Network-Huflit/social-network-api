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
import Post from './Post';

@Entity({
    name: 'post_asset',
})
@ObjectType()
export default class PostAsset extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    post_id: number;

    @Field(() => Post)
    @ManyToOne(() => Post, (post) => post.assets)
    @JoinColumn({ name: 'post_id' })
    post: Post;

    @Field()
    @Column()
    link: string;

    @Field()
    @Column()
    asset_type: string;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @Field()
    @DeleteDateColumn()
    deletedAt: Date;
}
