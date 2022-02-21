import { getModelForClass, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import {
    IsEmail,
    IsNotEmpty,
    IsNumberString,
    IsString, MaxLength, MinLength
} from 'class-validator-multi-lang';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class User extends TimeStamps {
    @Field((_return) => String)
    _id: string;

    @Field()
    @prop()
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    @MinLength(6)
    username: string;

    @Field()
    @prop()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @prop()
    @Field()
    @IsNotEmpty()
    @IsString()
    name: string;

    @prop()
    @IsNotEmpty()
    @IsString()
    password: string;

    @prop()
    @Field()
    @IsNotEmpty()
    @IsNumberString()
    @MinLength(10)
    @MaxLength(15)
    phoneNumber: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}

export const UserSchema = getModelForClass(User);
