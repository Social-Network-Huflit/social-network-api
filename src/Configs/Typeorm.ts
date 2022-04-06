import { createConnection } from 'typeorm';
import { __prod__ } from '../Constants';
import { entities } from '../Entities';

export default async function connectTypeorm() {
    await createConnection({
        type: !__prod__ ? 'mysql' : 'postgres',
        username: !__prod__ ? process.env.TYPEORM_USERNAME : undefined,
        password: !__prod__ ? process.env.TYPEORM_PASSWORD : undefined,
        database: !__prod__ ? process.env.TYPEORM_DATABASE : undefined,
        url: __prod__ ? process.env.TYPEORM_URL : undefined,
        synchronize: !__prod__,
        logging: !__prod__,
        entities,
    });
}
