import { createWriteStream } from 'fs';
import { join, parse } from 'path';
import { Upload } from '../Types';

export default async function uploadFile({ createReadStream, filename }: Upload): Promise<string> {
    let { name, ext } = parse(filename);

    name = `single${Math.floor(Math.random() * 10000 + 1)}`;
    let url = join(__dirname, `../public/${name}-${Date.now()}${ext}`);
    await createReadStream().pipe(createWriteStream(url));
    const { BASE_URL, PORT } = process.env;

    url = `${BASE_URL}:${PORT}${url.split('public')[1]}`;

    return url;
}
