import { Arg, Ctx, FieldResolver, ID, Mutation, Resolver, Root, UseMiddleware } from 'type-graphql';
import { Collection, CollectionDetail, Post, User } from '../../Entities';
import { Authentication } from '../../Middlewares/Auth.middleware';
import { Context, CollectionDetailMutationResponse, IMutationResponse } from '../../Types';
import i18n from 'i18n';

@Resolver(() => CollectionDetail)
export default class CollectionDetailResolver {
    @FieldResolver(() => Post, {nullable: true})
    async post(@Root() root: CollectionDetail): Promise<Post | null | undefined> {
        return Post.findOne({
            id: root.post_id,
        });
    }

    @UseMiddleware(Authentication)
    @Mutation(() => CollectionDetailMutationResponse)
    async addToCollection(
        @Arg('collection_id', () => ID) collection_id: number,
        @Arg('post_id', () => ID) post_id: number,
        @Ctx() { req }: Context
    ): Promise<CollectionDetailMutationResponse> {
        const user = await User.getMyUser(req);

        const collection = await Collection.findOne(collection_id);

        if (!collection) {
            return {
                code: 400,
                success: false,
                message: i18n.__('COLLECTION.ADD_ITEM_FAIL'),
            };
        }

        if (user.id !== collection.user_id) {
            return {
                code: 400,
                success: false,
                message: i18n.__('COLLECTION.ADD_ITEM_FAIL_PERMISSION'),
            };
        }

        const existingDetail = await CollectionDetail.findOne({
            post_id,
            collection_id,
        });

        if (existingDetail) {
            return {
                code: 400,
                success: false,
                message: i18n.__('COLLECTION.ADD_ITEM_FAIL_DUPLICATE'),
            };
        }

        const newDetail = CollectionDetail.create({
            post_id,
            collection_id,
        });

        return {
            code: 200,
            success: true,
            message: i18n.__('COLLECTION.ADD_ITEM_SUCCESS'),
            result: await newDetail.save(),
        };
    }

    @UseMiddleware(Authentication)
    @Mutation(() => IMutationResponse)
    async removeFromCollection(
        @Arg('collection_id', () => ID) collection_id: number,
        @Arg('post_id', () => ID) post_id: number,
        @Ctx() { req }: Context
    ): Promise<IMutationResponse> {
        const user = await User.getMyUser(req);

        const collection = await Collection.findOne(collection_id);

        if (!collection) {
            return {
                code: 400,
                success: false,
                message: i18n.__('COLLECTION.DELETE_ITEM_FAIL'),
            };
        }

        if (user.id !== collection.user_id) {
            return {
                code: 400,
                success: false,
                message: i18n.__('COLLECTION.DELETE_ITEM_FAIL_PERMISSION'),
            };
        }

        const detail = await CollectionDetail.findOne({
            post_id,
            collection_id,
        });

        if (!detail) {
            return {
                code: 400,
                success: false,
                message: i18n.__('COLLECTION.DELETE_ITEM_NOT_FIND'),
            };
        }

        await CollectionDetail.softRemove(detail);

        return {
            code: 200,
            success: true,
            message: i18n.__('COLLECTION.DELETE_ITEM_SUCCESS'),
        };
    }
}
