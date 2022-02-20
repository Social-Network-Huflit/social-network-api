import { Field, InputType } from "type-graphql";

@InputType()
export class RegisterInput{
    @Field()
    name!: string;

    @Field()
    email!: string;

    @Field()
    username!: string;

    @Field()
    password!: string;
}

@InputType()
export class LoginInput{
    @Field()
    usernameOrEmail!: string;

    @Field()
    password!: string;
}
