import { ObjectType, Field, ID } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Room, User, Post } from '..';

@ObjectType()
@Entity()
export default class Notify extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column()
    @Field()
    action: string;

    @Column()
    @Field()
    message: string;

    @Column()
    from_id: number;

    @Column()
    to_id: number;

    @Column()
    post_id: number;

    @ManyToOne(() => Post, (post) => post.notify)
    @JoinColumn({ name: 'post_id' })
    fromPost: Post;

    @ManyToOne(() => User, (user) => user.sent_notify)
    @JoinColumn({ name: 'from_id' })
    sender: User;

    @ManyToOne(() => User, (user) => user.received_notify)
    @JoinColumn({ name: 'to_id' })
    receiver: User;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}
