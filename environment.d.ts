declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            PORT: string;
            MONGO_DB_URL?: string;
            MONGO_DB_DEV?: string;
            SESSION_SECRET?: string;
            JWT_SECRET?: string;
            TYPEORM_USERNAME?: string;
            TYPEORM_PASSWORD?: string;
            TYPEORM_DATABASE?: string;
            TYPEORM_URL?: string;
            BASE_URL?: string;
            CLIENT_ID?: string;
            CLIENT_SECRET?: string;
            REDIRECT_URI?: string;
            REFRESH_TOKEN?: string;
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
