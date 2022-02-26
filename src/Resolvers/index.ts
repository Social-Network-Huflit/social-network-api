import { NonEmptyArray } from "type-graphql";
import AuthResolver from "./Auth";

const resolvers: NonEmptyArray<Function> = [AuthResolver]

export default resolvers