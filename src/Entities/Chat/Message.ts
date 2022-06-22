import { ObjectType, Field, ID } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Room, User } from '..';

@ObjectType()
@Entity()
export default class Message extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column()
    @Field()
    content: string;

    @Column()
    from_id: number;

    @Column()
    to_id: number;

    @Column()
    room_id: number;

    @ManyToOne(() => User, (user) => user.sent_messages)
    @JoinColumn({ name: 'from_id' })
    sender: User;

    @ManyToOne(() => User, (user) => user.received_messages)
    @JoinColumn({ name: 'to_id' })
    receiver: User;

    @ManyToOne(() => Room, (room) => room.messages)
    @JoinColumn({ name: 'room_id' })
    room: Room;

    @ManyToMany(() => User, user => user.seen_messages)
    @JoinTable({
        name: "seen_message"
    })
    @Field(() => [User])
    seen: Promise<User[]>;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
