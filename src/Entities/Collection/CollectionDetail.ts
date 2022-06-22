import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Collection, Post, User } from "..";

@ObjectType()
@Entity()
export default class CollectionDetail extends BaseEntity{
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    collection_id: number;

    @Column()
    post_id: number;

    @ManyToOne(() => Collection, collection => collection.details)
    // @Field(() => Collection)
    @JoinColumn({
        name: "collection_id"
    })
    collection: Collection;

    @ManyToOne(() => Post, post => post.collections)
    @JoinColumn({
        name: "post_id"
    })
    post: Post;

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