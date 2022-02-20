import { NonEmptyArray } from "type-graphql";
import AuthResolver from "./Auth";
import HelloResolver from "./Hello";

const resolvers: NonEmptyArray<Function> = [AuthResolver, HelloResolver]

export default resolvers