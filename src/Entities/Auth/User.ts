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
import {
    Collection,
    Follow,
    HistorySearch,
    Message,
    Post,
    PostComment,
    PostCommentLike,
    PostLike,
    PostReplyComment,
    PostReplyCommentLike,
    PostShare,
    PostShareComment,
    PostShareCommentLike,
    PostShareLike,
    PostShareReplyComment,
    PostShareReplyCommentLike,
    Room,
} from '..';
import { DEFAULT_AVATAR } from '../../Constants';
import { Request } from '../../Types';
import { AuthenticationError } from 'apollo-server-core';
import i18n from 'i18n';
import jwt from 'jsonwebtoken';
import { Logger } from '../../Configs';

@ObjectType()
@Entity({ name: 'user' })
export default class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field((_return) => ID)
    id: number;

    @Field()
    @Column()
    username: string;

    @Field()
    @Column()
    email: string;

    @Field()
    @Column()
    name: string;

    @Column()
    password: string;

    @Field()
    @Column()
    phoneNumber: string;

    @Field({ nullable: true })
    @Column({ nullable: true, default: 'http://localhost:4000/background.jpeg' })
    background: string;

    @Field()
    @Column({ default: DEFAULT_AVATAR })
    avatar: string;

    @Field(() => [Post])
    @OneToMany(() => Post, (post) => post.owner)
    posts: Post[];

    @Field(() => [PostLike])
    @OneToMany(() => PostLike, (postLike) => postLike.owner)
    likes_post: PostLike[];

    @Field(() => [PostComment])
    @OneToMany(() => PostComment, (post_comment) => post_comment.owner)
    comments_post: PostComment[];

    @Field(() => [PostCommentLike])
    @OneToMany(() => PostCommentLike, (post_comment_like) => post_comment_like.owner)
    likes_comment_post: PostCommentLike[];

    @Field(() => [PostReplyComment])
    @OneToMany(() => PostReplyComment, (post_reply_comment) => post_reply_comment.owner)
    reply_comments_post: PostReplyComment[];

    @Field(() => [PostReplyCommentLike])
    @OneToMany(
        () => PostReplyCommentLike,
        (post_reply_comment_like) => post_reply_comment_like.owner
    )
    likes_reply_comment_post: PostReplyCommentLike[];

    @Field(() => [PostShare])
    @OneToMany(() => PostShare, (post_share) => post_share.owner)
    posts_share: PostShare[];

    @Field(() => [PostShareComment])
    @OneToMany(() => PostShareComment, (post_share_comment) => post_share_comment.owner)
    comments_post_share: PostShareComment[];

    @Field(() => [PostShareCommentLike])
    @OneToMany(() => PostShareCommentLike, (like) => like.owner)
    likes_comment_post_share: PostShareCommentLike[];

    @Field(() => [PostShareLike])
    @OneToMany(() => PostShareLike, (like) => like.owner)
    likes_post_share: PostShareLike[];

    @Field(() => [PostShareReplyComment])
    @OneToMany(() => PostShareReplyComment, (comment) => comment.owner)
    reply_comments_post_share: PostShareReplyComment[];

    @Field(() => [PostShareReplyCommentLike])
    @OneToMany(() => PostShareReplyCommentLike, (like) => like.owner)
    likes_reply_comment_post_share: PostShareReplyCommentLike[];

    @Field(() => [User])
    @OneToMany(() => Follow, (follow) => follow.followers)
    following: User[];

    @Field(() => [User])
    @OneToMany(() => Follow, (follow) => follow.following)
    followers: User[];

    @Field(() => [HistorySearch])
    @ManyToMany(() => HistorySearch, (history) => history.owner)
    history: HistorySearch[];

    @ManyToMany(() => HistorySearch, (history) => history.user)
    history_2: HistorySearch[];

    @ManyToMany(() => Room, (room) => room.members)
    @JoinTable({
        name: 'room_members',
    })
    @Field(() => [Room])
    rooms: Promise<Room[]>;

    @OneToMany(() => Message, (message) => message.sender)
    sent_messages: Message[];

    @OneToMany(() => Message, (message) => message.sender)
    received_messages: Message[];

    @ManyToMany(() => Message, (message) => message.seen)
    @JoinTable({
        name: 'seen_message',
    })
    seen_messages: Promise<Message[]>;

    @OneToMany(() => Collection, (collection) => collection.owner)
    @Field(() => [Collection])
    collections: Collection[];

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    public static async getMyUser(req: Request): Promise<User> {
        let userId = req.session.userId;


        if (req.device?.type === 'phone') {
            const bearerToken = req.headers.authorization;

            const token = bearerToken?.replace('Bearer ', '');

            if (token) {
                jwt.verify(token, process.env.JWT_SECRET as string, (err, decode: any) => {
                    if (err) {
                        Logger.error(err);
                    } else {
                        userId = decode.id;
                    }
                });
            }
        }

        const user = await User.findOne({
            where: { id: userId },
        });

        if (!user) {
            throw new AuthenticationError(i18n.__('AUTH.FIND_USER_FAIL'));
        }

        return user;
    }
}
