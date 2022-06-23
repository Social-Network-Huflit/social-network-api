import { IsEmail, IsNotEmpty, IsString, IsNumberString } from 'class-validator-multi-lang';
import { GraphQLUpload } from 'graphql-upload';
import { Field, ID, InputType } from 'type-graphql';
import Upload from '../Upload';

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

@InputType()
export class ChangePasswordInput {
    @Field(() => ID)
    @IsNotEmpty()
    user_id!: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    newPassword!: string;
}

@InputType()
export class EditUserInput {
    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    username?: string;

    @Field({ nullable: true })
    phoneNumber?: string;

    @Field(() => GraphQLUpload, { nullable: true })
    avatar_file?: Upload;

    @Field(() => GraphQLUpload, { nullable: true })
    background_file?: Upload;
}
