import { ObjectType } from 'type-graphql';
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
import { User } from '..';

@Entity()
@ObjectType()
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

    @DeleteDateColumn()
    deletedAt: Date;
}
