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
import moment from 'moment';

import { Logger } from '../../Configs';
import { NEW_NOTI, ACTIONS } from '../../Constants/subscriptions.constant';
import { Notify, User, Post } from '../../Entities';
import { Authentication } from '../../Middlewares/Auth.middleware';
import { Context, CreateNotifyInput, NotifyMutationResponse, ServerInternal } from '../../Types';

@Resolver(() => Notify)
export default class NotificationResolver {
    @FieldResolver(() => User, { nullable: true })
    async sender(@Root() notify: Notify): Promise<User | null | undefined> {
        return await User.findOne(notify.from_id);
    }

    @FieldResolver(() => User, { nullable: true })
    async receiver(@Root() notify: Notify): Promise<User | null | undefined> {
        return await User.findOne(notify.to_id);
    }

    @FieldResolver(() => Post, { nullable: true })
    async fromPost(@Root() notify: Notify): Promise<Post | null | undefined> {
        return await Post.findOne(notify.post_id);
    }
    //timestamp
    @FieldResolver(() => String)
    timestamp(@Root() notify: Notify): string {
        return moment(notify.createdAt).fromNow();
    }

    @Mutation(() => NotifyMutationResponse)
    async sendNotify(
        @Arg('createNotifyInput') createNotifyInput: CreateNotifyInput,
        @Ctx() { req }: Context,
        @PubSub() pubSub: PubSubEngine
    ): Promise<NotifyMutationResponse> {
        const { from_id, action, post_id } = createNotifyInput;
        const { userId } = req.session;
        const post = await Post.findOne(post_id);
        if (post?.user_id === userId) {
            return {
                code: 400,
                success: false,
                message: 'Invalid sender',
            };
        }
        if (userId !== from_id) {
            return {
                code: 400,
                success: false,
                message: 'Invalid sender',
            };
        }
        try {
            const sender = await User.findOne(from_id);
            const receiver = await User.getMyUser(req);
            if (!receiver) {
                return {
                    code: 400,
                    success: false,
                    message: 'Invalid receiver',
                };
            }
            if (!sender) {
                return {
                    code: 400,
                    success: false,
                    message: 'Invalid sender',
                };
            }
            var newNotify = Notify.create({
                ...createNotifyInput,
                message: `${sender.name} đã ${action} về bài viết của bạn`,
                to_id: post?.user_id,
            });
            const result = await newNotify.save();
            pubSub.publish(NEW_NOTI, result);
            return {
                code: 200,
                success: true,
                message: 'Send notify successfully',
                result,
            };
        } catch (error: any) {
            Logger.error(error);
            throw new ServerInternal(error.message);
        }
    }
    @Subscription({
        topics: NEW_NOTI,
        filter: ({ payload, context }: ResolverFilterData<Notify, any, Context>) =>
            payload.to_id !== context.req.session.userId,
    })
    receiveNotify(@Root() notify: Notify): Notify {
        return notify;
    }
}
