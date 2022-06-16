import { NonEmptyArray } from 'type-graphql';
import AuthResolver from './Auth/AuthResolver';
import UserResolver from './Auth/UserResolver';
import PostResolver from './Post/PostResolver';
import InteractPostResolver from './Post/InteractPostResolver';
import PostShareResolver from './PostShare/PostShareResolver';
import InteractPostShareResolver from './PostShare/InteractPostShareResolver';
import PostLikeResolver from './Post/PostLikeResolver';
import PostCommentResolver from './Post/PostCommentResolver';
import PostCommentLikeResolver from './Post/PostCommentLikeResolver';
import PostReplyCommentResolver from './Post/PostReplyCommentResolver';
import PostReplyCommentLikeResolver from './Post/PostReplyCommentLikeResolver';
import PostShareLikeResolver from './PostShare/PostShareLikeResolver';
import PostShareCommentResolver from './PostShare/PostShareCommentResolver';
import PostShareCommentLikeResolver from './PostShare/PostShareCommentLikeResolver';
import PostShareReplyCommentResolver from './PostShare/PostShareReplyCommentResolver';
import PostShareReplyCommentLikeResolver from './PostShare/PostShareReplyCommentLikeResolver';
import MessageResolver from './Chat/MessageResolver';
import RoomResolver from './Chat/RoomResolver';
import UploadResolver from './Upload/UploadResolver';
import HistorySearchResolver from './Auth/HistorySearchResolver';

const resolvers: NonEmptyArray<Function> = [
    AuthResolver,
    UserResolver,
    PostResolver,
    PostLikeResolver,
    PostCommentResolver,
    PostCommentLikeResolver,
    PostReplyCommentResolver,
    PostReplyCommentLikeResolver,
    PostShareResolver,
    PostShareLikeResolver,
    PostShareCommentResolver,
    PostShareCommentLikeResolver,
    PostShareReplyCommentResolver,
    PostShareReplyCommentLikeResolver,
    InteractPostResolver,
    InteractPostShareResolver,
    MessageResolver,
    RoomResolver,
    UploadResolver,
    HistorySearchResolver
];

export default resolvers;
