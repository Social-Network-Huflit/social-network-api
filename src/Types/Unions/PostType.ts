import { createUnionType } from "type-graphql";
import { Post, PostShare } from "../../Entities";

export const PostType = createUnionType({
  name: "PostType", // the name of the GraphQL union
  types: () => [Post, PostShare] as const, // function that returns tuple of object types classes
});