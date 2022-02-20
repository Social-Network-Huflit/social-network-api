import { Field, ID, ObjectType } from "type-graphql";
import * as mongoose from 'mongoose'
import { getModelForClass, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@ObjectType()
export class User extends TimeStamps{
    @Field(_return => String)
    _id!: string;

    @Field()
    @prop()
    username!: string;

    @Field()
    @prop()
    email!: string;

    @prop()
    name!: string;

    @Field()
    @prop()
    password!: string;

    @Field()
    createdAt?: Date;

    @Field()
    updatedAt?: Date;
}

export const UserSchema = getModelForClass(User);
