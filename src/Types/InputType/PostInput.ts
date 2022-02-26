import { Field, InputType } from 'type-graphql';

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
export class LikeInput{
    @Field()
    user_id: number;

    @Field()
    post_id: number;
}
