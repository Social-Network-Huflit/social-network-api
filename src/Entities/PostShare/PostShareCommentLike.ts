import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PostShareComment, User } from "@Entities";

@Entity({name: "post_share_comment_like"})
@ObjectType()
export default class PostShareCommentLike extends BaseEntity{
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Field(() => User)
    @ManyToOne(() => User, user => user.likes_comment_post_share)
    @JoinColumn({name: "user_id"})
    owner: User

    @Field(() => PostShareComment)
    @ManyToOne(() => PostShareComment, post_share_comment => post_share_comment.likes)
    @JoinColumn({name: "post_share_comment_id"})
    comment: PostShareComment;

    @CreateDateColumn()
    @Field()
    createdAt: Date;

    @UpdateDateColumn()
    @Field()
    updatedAt: Date;
}