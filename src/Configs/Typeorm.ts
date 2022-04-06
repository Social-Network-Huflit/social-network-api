import { __prod__ } from '@Constants/index';
import { entities } from '@Entities';
import { createConnection } from 'typeorm';

export default async function connectTypeorm() {
    await createConnection({
        type: !__prod__ ? 'mysql' : 'postgres',
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        url: __prod__ ? process.env.TYPEORM_URL : undefined,
        synchronize: !__prod__,
        logging: !__prod__,
        entities,
    });
}
