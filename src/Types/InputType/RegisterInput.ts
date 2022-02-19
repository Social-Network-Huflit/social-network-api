import { Field, InputType } from "type-graphql";

@InputType()
export default class RegisterInput{
    @Field()
    name!: string;

    @Field()
    email!: string;

    @Field()
    username!: string;

    @Field()
    password!: string;
}
