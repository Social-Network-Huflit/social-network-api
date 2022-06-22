import { createWriteStream } from 'fs';
import { GraphQLUpload } from 'graphql-upload';
import { join, parse } from 'path';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { Upload } from '../../Types';
import uploadFile from '../../Utils/UploadFile';

@Resolver()
export default class UploadResolver {
    @Mutation(() => String)
    async uploadSingle(@Arg('file', () => GraphQLUpload) file: Upload): Promise<string> {
        const url = await uploadFile(file);

        return url;
    }

    @Mutation(() => [String])
    async uploadMultiple(@Arg('files', () => [GraphQLUpload]) files: Upload[]): Promise<string[]> {
        const urls: string[] = [];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            urls.push(await uploadFile(file));
        }

        return urls;
    }
}
