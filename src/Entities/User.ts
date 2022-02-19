import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
@ObjectType()
export default class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    @Field(_return => ID)
    id!: number;

    @Column()
    @Field()
    username!: string;

    @Column()
    @Field()
    email!: string;

    @Column()
    @Field()
    name!: string;

    @Column()
    @Field()
    password!: string;

    @CreateDateColumn({nullable: true})
    @Field({nullable: true})
    createdAt?: Date;

    @UpdateDateColumn({nullable: true})
    @Field({nullable: true})
    updatedAt?: Date;
}
