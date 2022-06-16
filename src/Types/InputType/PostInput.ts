import { IsNotEmpty, IsNumber, IsString } from 'class-validator-multi-lang';
import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class CreatePostInput {
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
