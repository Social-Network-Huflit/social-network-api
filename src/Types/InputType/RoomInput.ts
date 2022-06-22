import { IsNotEmpty, IsString } from "class-validator-multi-lang";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateRoomInput{
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    avatar: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    last_message: string;
}