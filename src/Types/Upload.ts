import { ObjectType } from "type-graphql";
import { Stream } from "stream";

@ObjectType()
export default class Upload{
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => Stream
}
