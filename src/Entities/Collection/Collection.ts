import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CollectionDetail, User } from "..";

@ObjectType()
@Entity()
export default class Collection extends BaseEntity{
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Field()
    @Column()
    name: string;

    @OneToMany(() => CollectionDetail, detail => detail.collection)
    @Field(() => [CollectionDetail])
    details: CollectionDetail[];

    @ManyToOne(() => User, user => user.collections)
    @JoinColumn({
        name: "user_id"
    })
    @Field(() => User)
    owner: User;

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