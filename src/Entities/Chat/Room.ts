import { Field, ID, ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Message, User } from '..';

@ObjectType()
@Entity()
export default class Room extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    name: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    avatar: string;

    @Column()
    @Field()
    last_message: string;

    @ManyToMany(() => User, user => user.rooms)
    @JoinTable({
        name: "room_members"
    })
    @Field(() => [User])
    members: Promise<User[]>;

    @OneToMany(() => Message, message => message.room)
    @Field(() => [Message])
    messages: Message[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
