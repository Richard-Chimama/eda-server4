import { Query } from "./Query.js";
import { Mutation } from "./Mutation.js";
import {resolverMap} from "./Date.js"
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query,
    Mutation,
    DateTime: resolverMap.Date
}

export default resolvers
