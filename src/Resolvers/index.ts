import { NonEmptyArray } from 'type-graphql';
import AuthResolver from './Auth/AuthResolver';
import UserResolver from './Auth/UserResolver';
import PostResolver from './Post/PostResolver';
import InteractPostResolver from './Post/InteractPostResolver';
import PostShareResolver from './PostShare/PostShareResolver';
import InteractPostShareResolver from './PostShare/InteractPostShareResolver';

const resolvers: NonEmptyArray<Function> = [
    AuthResolver,
    UserResolver,
    PostResolver,
    InteractPostResolver,
    PostShareResolver,
    InteractPostShareResolver,
];

export default resolvers;
