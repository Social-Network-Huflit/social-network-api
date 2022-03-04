import { User } from '@Entities';
import { ObjectType } from 'type-graphql';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export default class Follow extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.following)
    @JoinColumn({ name: 'user_1' })
    followers: User;

    @Column()
    user_1: number;

    @ManyToOne(() => User, (user) => user.followers)
    @JoinColumn({ name: 'user_2' })
    following: User;

    @Column()
    user_2: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
