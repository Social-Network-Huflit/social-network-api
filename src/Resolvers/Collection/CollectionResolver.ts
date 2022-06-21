import {
    Arg,
    Ctx,
    FieldResolver,
    ID,
    Mutation,
    Query,
    Resolver,
    Root,
    UseMiddleware,
} from 'type-graphql';
import { Collection, CollectionDetail, Post, User } from '../../Entities';
import { Authentication } from '../../Middlewares/Auth.middleware';
import i18n from 'i18n';
import { CollectionMutationResponse, Context, IMutationResponse } from '../../Types';

@Resolver(() => Collection)
export default class CollectionResolver {
    @FieldResolver(() => [CollectionDetail])
    async details(@Root() root: Collection): Promise<CollectionDetail[]> {
        return await CollectionDetail.find({
            collection_id: root.id,
        });
    }

    @FieldResolver(() => User, { nullable: true })
    async owner(@Root() root: Collection): Promise<User | null | undefined> {
        return await User.findOne(root.user_id);
    }

    @FieldResolver(() => Boolean)
    async postExist(
        @Root() root: Collection,
        @Arg('post_id', () => ID) post_id: number
    ): Promise<boolean> {
        let result = false;

        const post = await Post.findOne(post_id);

        if (!post) result = false;

        const collection = await CollectionDetail.find({
            collection_id: root.id,
        });

        for (let i = 0; i < collection.length; i++) {
            const element = collection[i];

            if (element.post_id.toString() === post_id.toString()) result = true;
        }

        return result;
    }

    @UseMiddleware(Authentication)
    @Mutation(() => CollectionMutationResponse)
    async createCollection(
        @Arg('name') name: string,
        @Ctx() { req }: Context
    ): Promise<CollectionMutationResponse> {
        const user = await User.getMyUser(req);

        const existingCollection = await Collection.findOne({
            name,
            user_id: user.id,
        });

        if (existingCollection) {
            return {
                code: 400,
                success: false,
                message: i18n.__('COLLECTION.CREATE_DUPLICATE'),
            };
        }

        const newCollection = Collection.create({
            name,
            user_id: user.id,
        });

        return {
            code: 201,
            success: true,
            message: i18n.__('COLLECTION.CREATE_SUCCESS'),
            result: await newCollection.save(),
        };
    }

    @UseMiddleware(Authentication)
    @Mutation(() => CollectionMutationResponse)
    async deleteCollection(
        @Arg('id', () => ID) id: number,
        @Ctx() { req }: Context
    ): Promise<CollectionMutationResponse> {
        const user = await User.getMyUser(req);

        const existingCollection = await Collection.findOne(id);

        if (!existingCollection) {
            return {
                code: 400,
                success: false,
                message: i18n.__('COLLECTION.DELETE_FAIL'),
            };
        }

        if (existingCollection.user_id !== user.id) {
            return {
                code: 400,
                success: false,
                message: i18n.__('COLLECTION.DELETE_FAIL_PERMISSION'),
            };
        }

        const details = await CollectionDetail.find({
            collection_id: id,
        });

        await CollectionDetail.softRemove(details);

        await Collection.softRemove(existingCollection);

        return {
            code: 201,
            success: true,
            message: i18n.__('COLLECTION.DELETE_SUCCESS'),
        };
    }

    @UseMiddleware(Authentication)
    @Query(() => [Collection])
    async getMyCollection(@Ctx() { req }: Context): Promise<Collection[]> {
        const user = await User.getMyUser(req);

        return Collection.find({
            user_id: user.id,
        });
    }

    @UseMiddleware(Authentication)
    @Query(() => Collection, { nullable: true })
    async getCollection(
        @Ctx() { req }: Context,
        @Arg('collection_id', () => ID) collection_id: number
    ): Promise<Collection | null | undefined> {
        const user = await User.getMyUser(req);

        return Collection.findOne({
            user_id: user.id,
            id: collection_id,
        });
    }
}
