import { IsNotEmpty, IsNumber, IsString } from 'class-validator-multi-lang';
import { GraphQLUpload } from 'graphql-upload';
import { Field, ID, InputType } from 'type-graphql';
import { Upload } from '..';

@InputType()
export class CreatePostInput {
    @Field({ nullable: true })
    caption?: string;

    @Field(() => [GraphQLUpload], { nullable: true })
    files: Upload[]

    @Field({ nullable: true })
    youtube_link?: string;
}

@InputType()
export class UpdatePostInput {
    @Field(() => ID)
    id: number;

    @Field({ nullable: true })
    caption?: string;

    @Field({ nullable: true })
    image_link?: string;

    @Field({ nullable: true })
    video_link?: string;

    @Field({ nullable: true })
    youtube_link?: string;
}

@InputType()
export class CreateCommentPostInput {
    @Field(() => ID)
    @IsNotEmpty()
    post_id: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    content: string;
}

@InputType()
export class UpdateCommentPostInput {
    @Field(() => ID)
    @IsNotEmpty()
    id: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    content: string;
}

@InputType()
export class ReplyCommentPostInput {
    @Field(() => ID)
    @IsNotEmpty()
    comment_id: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    content: string;
}
