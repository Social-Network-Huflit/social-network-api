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
import { Context } from '../../Types';

@Resolver(() => Room)
export default class RoomResolver {
    @FieldResolver(() => [User])
    async members(@Root() room: Room): Promise<User[]> {
        return await room.members;
    }

    @FieldResolver(() => [Message])
    async messages(@Root() room: Room): Promise<Message[]> {
        return await Message.find({
            room_id: room.id,
        });
    }

    @Query(() => Boolean)
    initRoom(@PubSub() pubSub: PubSubEngine) {
        try {
            pubSub.publish(GET_ROOM, null);
            return true;
        } catch (error) {
            Logger.error(error);
            return false;
        }
    }

    @Subscription(() => [Room], {
        topics: GET_ROOM,
        filter: async ({ context, payload }: ResolverFilterData<Room | null, any, Context>) => {
            if (!payload){
                return true;
            }

            const members = await payload.members;

            return members.filter((item) => item.id === context.req.session.userId).length > 0;
        },
    })
    async getRooms(@Ctx() { req }: Context): Promise<Room[]> {
        const { userId } = req.session;

        const subQuery = getConnection()
            .createQueryBuilder()
            .select(`"roomId"`)
            .from('room_members', 'room_members')
            .where(`"room_members"."userId" = ${userId}`)
            .getSql();

        const room: Room[] = await getConnection()
            .createQueryBuilder()
            .select('*')
            .from('room', 'room')
            .where(`"room"."id" IN (${subQuery})`)
            .getRawMany();

        return room;
    }
}
