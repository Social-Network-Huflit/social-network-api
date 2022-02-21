import { IsEmail, IsNotEmpty, IsString, IsNumberString } from 'class-validator-multi-lang';
import { Field, InputType } from 'type-graphql';

@InputType()
export class RegisterInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name!: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    username!: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    password!: string;

    @Field()
    @IsNumberString()
    @IsNotEmpty()
    phoneNumber: string;
}

@InputType()
export class LoginInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    usernameOrEmail!: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    password!: string;
}
