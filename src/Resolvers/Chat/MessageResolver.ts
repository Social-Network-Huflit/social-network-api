import {
    Arg,
    Ctx,
    FieldResolver,
    ID,
    Mutation,
    PubSub,
    PubSubEngine,
    Query,
    Resolver,
    ResolverFilterData,
    Root,
    Subscription,
    SubscriptionOptions,
    UseMiddleware,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Logger } from '../../Configs';
import { GET_ROOM, NEW_MESSAGE } from '../../Constants/subscriptions.constant';
import { Message, Room, User } from '../../Entities';
import { Authentication } from '../../Middlewares/Auth.middleware';
import { Context, CreateMessageInput, MessageMutationResponse, ServerInternal } from '../../Types';

@Resolver(() => Message)
export default class MessageResolver {
    @FieldResolver(() => User, { nullable: true })
    async sender(@Root() message: Message): Promise<User | null | undefined> {
        return await User.findOne(message.from_id);
    }

    @FieldResolver(() => User, { nullable: true })
    async receiver(@Root() message: Message): Promise<User | null | undefined> {
        return await User.findOne(message.to_id);
    }

    @FieldResolver(() => Room)
    async room(@Root() message: Message): Promise<Room | null | undefined> {
        return await Room.findOne(message.room_id);
    }

    @FieldResolver(() => [User])
    async seen(@Root() message: Message): Promise<User[]> {
        return await message.seen;
    }

    @FieldResolver(() => Boolean)
    isSender(@Root() message: Message, @Ctx() { req }: Context): boolean {
        return req.session.userId === message.from_id;
    }

    @Mutation(() => MessageMutationResponse)
    @UseMiddleware(Authentication)
    async sendMessage(
        @Arg('createMessageInput') createMessageInput: CreateMessageInput,
        @Ctx() { req }: Context,
        @PubSub() pubSub: PubSubEngine
    ): Promise<MessageMutationResponse> {
        const { content, room_id, to_id } = createMessageInput;
        const userId = (await User.getMyUser(req)).id;

        if (userId === to_id) {
            return {
                code: 400,
                success: false,
                message: 'Invalid receiver',
            };
        }

        try {
            let room: Room | undefined = undefined;
            const sender = await User.getMyUser(req);

            //create new room
            if (!room_id) {
                if (!to_id) {
                    return {
                        code: 400,
                        success: false,
                        message: 'Invalid receiver',
                    };
                }

                const receiver = await User.findOne(to_id);

                if (!receiver) {
                    return {
                        code: 400,
                        success: false,
                        message: 'Invalid receiver',
                    };
                }

                const sender_room = await getConnection()
                    .createQueryBuilder()
                    .select(`"roomId"`)
                    .from('room_members', 'room_members')
                    .where(`"room_members"."userId" = ${sender.id}`)
                    .getRawMany();

                const receiver_room = await getConnection()
                    .createQueryBuilder()
                    .select(`"roomId"`)
                    .from('room_members', 'room_members')
                    .where(`"room_members"."userId" = ${receiver.id}`)
                    .getRawMany();

                for (let i = 0; i < sender_room.length; i++) {
                    const element = sender_room[i];

                    if (receiver_room.map((item) => item.roomId).includes(element.roomId)) {
                        room = await Room.findOne(element.roomId);
                    }
                }

                if (!room) {
                    const newRoom = new Room();
                    newRoom.members = new Promise((resolver) => resolver([sender, receiver]));

                    room = await newRoom.save();
                }
            }

            if (!room) {
                room = await Room.findOne(room_id);

                if (!room) {
                    return {
                        code: 400,
                        success: false,
                        message: 'Can not find room',
                    };
                }
            }

            const members = await room.members;

            const receiver = members.filter((item) => item.id !== sender.id)[0].id;

            await Room.update(
                {
                    id: room.id,
                },
                {}
            );

            const newMessage = Message.create({
                ...createMessageInput,
                room_id: room.id,
                from_id: userId,
                to_id: receiver,
            });

            const result = await newMessage.save();

            pubSub.publish(NEW_MESSAGE, result);
            pubSub.publish(GET_ROOM, room);

            return {
                code: 200,
                success: true,
                message: 'Send message successfully',
                result,
            };
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error.message);
        }
    }

    @Query(() => [Message])
    async getMessage(@Arg('room_id', () => ID) room_id: number): Promise<Message[]> {
        const room = await Room.findOne(room_id);

        if (!room) return [];

        return await Message.find({
            where: { room_id: room.id },
            order: {
                createdAt: 'ASC',
            },
        });
    }

    @Subscription({
        topics: NEW_MESSAGE,
        filter: ({ payload, args }: ResolverFilterData<Message, { room_id: string }, Context>) => {
            if (payload.room_id === parseInt(args.room_id)) {
                return true;
            }
            return false;
        },
    })
    receiveMessage(@Root() payload: Message, @Arg('room_id', () => ID) room_id: number): Message {
        return payload;
    }
}
