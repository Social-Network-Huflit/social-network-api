import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "..";

@Entity({
    name: "history_search"
})
@ObjectType()
export default class HistorySearch extends BaseEntity{
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id_1: number;

    @Column()
    user_id_2: number;

    @ManyToOne(() => User, user => user.history)
    @Field(() => User)
    @JoinColumn({
        name: "user_id_1"
    })
    owner: User;

    @ManyToOne(() => User, user => user.history_2)
    @Field(() => User)
    @JoinColumn({
        name: "user_id_2"
    })
    user: User;

    @CreateDateColumn()
    @Field()
    createdAt: Date;

    @UpdateDateColumn()
    @Field()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}