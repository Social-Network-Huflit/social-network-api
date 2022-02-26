import User from './User';
import Post from './Post/Post';
import PostLike from './Post/PostLike';
import PostComment from './Post/PostComment';
import PostCommentLike from './Post/PostCommentLike';
import PostReplyComment from './Post/PostReplyComment';
import PostReplyCommentLike from './Post/PostReplyCommentLike';

export {default as User} from './User';
export {default as Post} from './Post/Post';
export {default as PostLike} from './Post/PostLike';
export {default as PostComment} from './Post/PostComment';
export {default as PostCommentLike} from './Post/PostCommentLike';
export {default as PostReplyComment} from './Post/PostReplyComment';
export {default as PostReplyCommentLike} from './Post/PostReplyCommentLike';

export const entities = [User, Post, PostLike, PostComment, PostCommentLike, PostReplyComment, PostReplyCommentLike]