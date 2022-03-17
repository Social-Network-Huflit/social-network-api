import { IsNotEmpty, IsNumber, IsString } from 'class-validator-multi-lang';
import { Field, InputType} from 'type-graphql';

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
    @Field()
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
export class CreateCommentPostInput{
    @Field()
    @IsNumber()
    @IsNotEmpty()
    post_id: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    content: string;
}

@InputType()
export class UpdateCommentPostInput{
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
export class ReplyCommentPostInput{
    @Field()
    @IsNumber()
    @IsNotEmpty()
    comment_id: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    content: string;
}
