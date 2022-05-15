import { Arg, FieldResolver, Mutation, Resolver, Root, UseMiddleware } from 'type-graphql';
import { Room, Message, User } from '../../Entities';
import { Authentication } from '../../Middlewares/Auth.middleware';
import { CreateRoomInput } from '../../Types';

@Resolver(() => Room)
export default class RoomResolver {
    @FieldResolver(() => [User])
    async members(@Root() room: Room): Promise<User[]> {
        return await room.members;
    }

    @FieldResolver(() => [Message])
    async messages(@Root() room: Room): Promise<Message[]> {
        return await room.messages;
    }

    @Mutation(() => Room)
    async createRoom(@Arg('createRoomInput') input: CreateRoomInput): Promise<Room> {
        const room = Room.create(input);

        return await room.save();
    }
}
