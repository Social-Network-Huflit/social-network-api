export const COOKIES_NAME = 'social-network';
export const __prod__ = process.env.NODE_ENV === 'production';
export const DEFAULT_AVATAR = 'https://i.stack.imgur.com/l60Hf.png';
export const MONGO_DB_URL = __prod__ ? process.env.MONGO_DB_URL as string : process.env.MONGO_DB_DEV as string;
