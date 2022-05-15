import { gql } from 'apollo-server-express';
import { PubSub } from 'graphql-subscriptions';
import { NEW_MESSAGE } from '../../Constants/subscriptions.constant';

const pubSub = new PubSub();

export const ChatTypeDefs = gql`
    type Subscription {
        receiveMessage: String
    }
`;

export const ChatResolver = {
    Subscription: {
        receiveMessage: {
            subscribe: () => pubSub.asyncIterator(NEW_MESSAGE),
            resolve: () => `${new Date().getTime()}`,
        },
    },
};
