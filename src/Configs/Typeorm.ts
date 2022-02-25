import { createConnection } from 'typeorm';
import { __prod__ } from '../Constants';
import { entities } from '../Entities';

export default async function connectTypeorm() {
    await createConnection({
        type: 'mysql',
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        url: __prod__ ? process.env.TYPEORM_URL : undefined,
        synchronize: !__prod__,
        logging: !__prod__,
        entities
    });
}
