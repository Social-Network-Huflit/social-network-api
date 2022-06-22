import { IsNotEmpty, IsNumber, IsString } from 'class-validator-multi-lang';
import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class CreatePostShareInput {
    @Field({ nullable: true })
    caption?: string;

    @Field(() => ID)
    @IsNotEmpty()
    post_id: number;
}

@InputType()
export class UpdatePostShareInput {
    @Field()
    id: number;

    @Field({ nullable: true })
    caption?: string;
}

@InputType()
export class CreateCommentPostShareInput {
    @Field(() => ID)
    @IsNotEmpty()
    post_share_id: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    content: string;
}

@InputType()
export class UpdateCommentPostShareInput {
    @Field(() => ID)
    @IsNotEmpty()
    id: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    content: string;
}

@InputType()
export class ReplyCommentPostShareInput {
    @Field(() => ID)
    @IsNotEmpty()
    comment_id: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    content: string;
}
