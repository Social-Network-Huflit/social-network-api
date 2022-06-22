import {
    Arg,
    Ctx,
    FieldResolver,
    Mutation,
    PubSub,
    PubSubEngine,
    Resolver,
    ResolverFilterData,
    Root,
    Subscription,
    SubscriptionOptions,
    UseMiddleware,
} from 'type-graphql';
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
        const { userId } = req.session;

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
            const receiver = await User.findOne(to_id);

            if (!receiver) {
                return {
                    code: 400,
                    success: false,
                    message: 'Invalid receiver',
                };
            }

            //create new room
            if (!room_id) {
                const newRoom = new Room();
                newRoom.last_message = content;
                newRoom.members = new Promise((resolver) => resolver([sender, receiver]));

                room = await newRoom.save();
            }

            //update last message
            if (!room) {
                room = await Room.findOne(room_id);

                if (!room) {
                    return {
                        code: 400,
                        success: false,
                        message: 'Can not find room',
                    };
                }

                await Room.update(
                    {
                        id: room.id,
                    },
                    {
                        last_message: content,
                    }
                );
            }

            const newMessage = Message.create({
                ...createMessageInput,
                room_id: room.id,
                from_id: userId,
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

    @Subscription({
        topics: NEW_MESSAGE,
        filter: ({ payload, context }: ResolverFilterData<Message, any, Context>) =>
            payload.from_id === context.req.session.userId,
    })
    receiveMessage(@Root() message: Message): Message {
        return message;
    }
}
