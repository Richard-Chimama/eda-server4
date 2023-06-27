import { Query } from "./Query.js";
import { Mutation } from "./Mutation.js";
import {resolverMap} from "./Date.js"
import {Subscription } from "./Subscription.js";
//import { UploadScalar} from "./Upload.js"
import GraphQLUpload  from "graphql-upload/GraphQLUpload.mjs"
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query,
    Mutation,
    Subscription,
    DateTime: resolverMap.Date,
    Upload: GraphQLUpload
}

export default resolvers
