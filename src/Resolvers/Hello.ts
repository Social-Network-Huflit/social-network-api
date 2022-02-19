import { Query, Resolver } from "type-graphql";

@Resolver()
export default class HelloResolver{
    @Query(_return => String)
    hello(): string{
        return "Hello Doba";
    }
}
