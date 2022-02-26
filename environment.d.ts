declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        PORT: string;
        MONGO_DB_URL?: string;
        SESSION_SECRET?: string;
        TYPEORM_USERNAME?: string;
        TYPEORM_PASSWORD?: string;
        TYPEORM_DATABASE?: string;
        TYPEORM_URL?: string;
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}