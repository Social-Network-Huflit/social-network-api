import { FieldResolver, Mutation, Resolver, Root, UseMiddleware } from 'type-graphql';
import { Room, Message, User } from '../../Entities';
import { Authentication } from '../../Middlewares/Auth.middleware';

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

    // @Mutation()
    // @UseMiddleware(Authentication)
    // async createNewMessage() {}
}
