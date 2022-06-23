import { NonEmptyArray } from 'type-graphql';
import AuthResolver from './Auth/AuthResolver';
import HistorySearchResolver from './Auth/HistorySearchResolver';
import UserResolver from './Auth/UserResolver';
import MessageResolver from './Chat/MessageResolver';
import RoomResolver from './Chat/RoomResolver';
import CollectionDetailResolver from './Collection/CollectionDetailResolver';
import CollectionResolver from './Collection/CollectionResolver';
import NotificationResolver from './Notification/NotifyResolver';
import InteractPostResolver from './Post/InteractPostResolver';
import PostCommentLikeResolver from './Post/PostCommentLikeResolver';
import PostCommentResolver from './Post/PostCommentResolver';
import PostLikeResolver from './Post/PostLikeResolver';
import PostReplyCommentLikeResolver from './Post/PostReplyCommentLikeResolver';
import PostReplyCommentResolver from './Post/PostReplyCommentResolver';
import PostResolver from './Post/PostResolver';
import InteractPostShareResolver from './PostShare/InteractPostShareResolver';
import PostShareCommentLikeResolver from './PostShare/PostShareCommentLikeResolver';
import PostShareCommentResolver from './PostShare/PostShareCommentResolver';
import PostShareLikeResolver from './PostShare/PostShareLikeResolver';
import PostShareReplyCommentLikeResolver from './PostShare/PostShareReplyCommentLikeResolver';
import PostShareReplyCommentResolver from './PostShare/PostShareReplyCommentResolver';
import PostShareResolver from './PostShare/PostShareResolver';
import UploadResolver from './Upload/UploadResolver';

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
    HistorySearchResolver,
    CollectionResolver,
    CollectionDetailResolver,
    NotificationResolver,
];

export default resolvers;
