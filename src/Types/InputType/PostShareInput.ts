import { IsNotEmpty, IsNumber, IsString } from 'class-validator-multi-lang';
import { Field, InputType} from 'type-graphql';

@InputType()
export class CreatePostShareInput {
    @Field({ nullable: true })
    caption?: string;
}

@InputType()
export class UpdatePostShareInput {
    @Field()
    id: number;

    @Field({ nullable: true })
    caption?: string;
}

@InputType()
export class CreateCommentPostShareInput{
    @Field()
    @IsNumber()
    @IsNotEmpty()
    post_share_id: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    content: string;
}

@InputType()
export class UpdateCommentPostShareInput{
    @Field()
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    content: string;
}

@InputType()
export class DeleteCommentPostShareInput{
    @Field()
    @IsNumber()
    @IsNotEmpty()
    post_share_id: number;

    @Field()
    @IsNumber()
    @IsNotEmpty()
    comment_id: number;
}

@InputType()
export class ReplyCommentPostShareInput{
    @Field()
    @IsNumber()
    @IsNotEmpty()
    comment_id: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    content: string;
}
