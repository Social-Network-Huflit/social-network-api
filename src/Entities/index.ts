import User from './User';
import Post from './Post/Post';
import PostLike from './Post/PostLike';

export {default as User} from './User';
export {default as Post} from './Post/Post';
export {default as PostLike} from './Post/PostLike';

export const entities = [User, Post, PostLike]