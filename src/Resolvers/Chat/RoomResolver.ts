import moment from 'moment';
import {
    Ctx,
    FieldResolver,
    PubSub,
    PubSubEngine,
    Query,
    Resolver,
    ResolverFilterData,
    Root,
    Subscription,
    UseMiddleware,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { Logger } from '../../Configs';
import { GET_ROOM } from '../../Constants/subscriptions.constant';
import { Message, Room, User } from '../../Entities';
import { Authentication } from '../../Middlewares/Auth.middleware';
import { Context, Request } from '../../Types';

@Resolver(() => Room)
export default class RoomResolver {
    @FieldResolver(() => [User])
    async members(@Root() room: Room): Promise<User[]> {
        return await room.members;
    }

    @FieldResolver(() => [Message])
    async messages(@Root() room: Room): Promise<Message[]> {
        return await Message.find({
            where: { room_id: room.id },
            order: {
                createdAt: 'DESC',
            },
        });
    }

    @FieldResolver(() => String)
    async avatar(@Root() room: Room, @Ctx() { req }: Context): Promise<string> {
        const members = await room.members;
        const user = await User.getMyUser(req);

        const elseUser = members.filter((item) => item.id !== user.id)[0];

        return elseUser.avatar;
    }

    @FieldResolver(() => String)
    timestamp(@Root() room: Room, @Ctx() { req }: Context): string {
        return moment(room.updatedAt).fromNow();
    }

    @FieldResolver(() => String)
    async name(@Root() room: Room, @Ctx() { req }: Context): Promise<string> {
        const members = await room.members;
        const user = await User.getMyUser(req);

        const elseUser = members.filter((item) => item.id !== user.id)[0];

        return elseUser.name;
    }

    @FieldResolver(() => String, { nullable: true })
    async last_message(
        @Root() room: Room,
        @Ctx() { req }: Context
    ): Promise<string | null | undefined> {
        const messages = await Message.find({
            where: { room_id: room.id },
            order: {
                createdAt: 'DESC',
            },
        });

        if (messages.length === 0) return null;

        return messages[0].content;
    }

    private async getListRooms(req: Request) {
        const userId = (await User.getMyUser(req)).id;

        const subQuery = getConnection()
            .createQueryBuilder()
            .select(`"roomId"`)
            .from('room_members', 'room_members')
            .where(`"room_members"."userId" = ${userId}`)
            .getSql();

        const rooms: Room[] = await getConnection()
            .createQueryBuilder()
            .select('*')
            .from('room', 'room')
            .where(`"room"."id" IN (${subQuery})`)
            .orderBy(`"room"."updatedAt"`, 'DESC')
            .getRawMany();

        return rooms;
    }

    @Query(() => [Room])
    async initRoom(@PubSub() pubSub: PubSubEngine, @Ctx() { req }: Context): Promise<Room[]> {
        try {
            const room = await this.getListRooms(req);

            pubSub.publish(GET_ROOM, null);
            return room;
        } catch (error) {
            Logger.error(error);

            return [];
        }
    }

    @Subscription(() => [Room], {
        topics: GET_ROOM,
        filter: async ({ context, payload }: ResolverFilterData<Room | null, any, Context>) => {
            if (!payload) {
                return true;
            }

            const members = await payload.members;
            const user = await User.getMyUser(context.req);

            return members.filter((item) => item.id === user.id).length > 0;
        },
    })
    async getRooms(@Ctx() { req }: Context): Promise<Room[]> {
        const room = await this.getListRooms(req);

        return room;
    }
}
