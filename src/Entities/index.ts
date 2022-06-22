import User from './Auth/User';
import Follow from './Auth/Follow';

//Post
import Post from './Post/Post';
import PostLike from './Post/PostLike';
import PostComment from './Post/PostComment';
import PostCommentLike from './Post/PostCommentLike';
import PostReplyComment from './Post/PostReplyComment';
import PostReplyCommentLike from './Post/PostReplyCommentLike';

//Post Share
import PostShare from './PostShare/PostShare';
import PostShareComment from './PostShare/PostShareComment';
import PostShareCommentLike from './PostShare/PostShareCommentLike';
import PostShareLike from './PostShare/PostShareLike';
import PostShareReplyComment from './PostShare/PostShareReplyComment';
import PostShareReplyCommentLike from './PostShare/PostShareReplyCommentLike';
import Message from './Chat/Message';
import Room from './Chat/Room';
import HistorySearch from './Auth/HistorySearch';
import PostAsset from './Post/PostAsset';
import Collection from './Collection/Collection';
import CollectionDetail from './Collection/CollectionDetail';

export { default as User } from './Auth/User';
export { default as Follow } from './Auth/Follow';
export { default as HistorySearch } from './Auth/HistorySearch';

//Post
export { default as Post } from './Post/Post';
export { default as PostLike } from './Post/PostLike';
export { default as PostComment } from './Post/PostComment';
export { default as PostCommentLike } from './Post/PostCommentLike';
export { default as PostReplyComment } from './Post/PostReplyComment';
export { default as PostReplyCommentLike } from './Post/PostReplyCommentLike';
export { default as PostAsset } from './Post/PostAsset';

//Post Share
export { default as PostShare } from './PostShare/PostShare';
export { default as PostShareComment } from './PostShare/PostShareComment';
export { default as PostShareCommentLike } from './PostShare/PostShareCommentLike';
export { default as PostShareLike } from './PostShare/PostShareLike';
export { default as PostShareReplyComment } from './PostShare/PostShareReplyComment';
export { default as PostShareReplyCommentLike } from './PostShare/PostShareReplyCommentLike';

//Chat
export { default as Message } from './Chat/Message';
export { default as Room } from './Chat/Room';

//Collection
export { default as Collection } from './Collection/Collection';
export { default as CollectionDetail } from './Collection/CollectionDetail';

export const entities = [
    User,
    Follow,
    Post,
    PostLike,
    PostComment,
    PostCommentLike,
    PostReplyComment,
    PostReplyCommentLike,
    PostShare,
    PostShareComment,
    PostShareCommentLike,
    PostShareLike,
    PostShareReplyComment,
    PostShareReplyCommentLike,
    Message,
    Room,
    HistorySearch,
    PostAsset,
    Collection,
    CollectionDetail
];
