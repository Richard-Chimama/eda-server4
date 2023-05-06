// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  scalar DateTime
 
  # This "Book" type defines the queryable fields for every book in our data source.
  type Users{
    id: ID!,
    username: String!
    email: String!
    avatar: String
    cnop: String
    password: String!
    role: String
    hospital: [Hospital]
  }

  type Hospital{
    id: ID,
    name: String!
    address: String!
    city: String!
    user: [Users]
    category: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    #Hospitals query
    hospitals: [Hospital]
    hospital(id: ID!): Hospital
    checkHospital(name: String): Boolean!

    #Users query
    users: [Users!]!
    user(id: ID!): Users
    me: Users!
  }

  type Mutation{
    #Hospitals mutations
    newHospital(name: String!, address: String!, city:String!, category:String!, user: String): Hospital!
    updateHospital(id: ID!, name: String, address: String, city:String,  user:String): Hospital
    deleteHospital(id: ID!): Boolean!

    #Users
    signUp(username: String!, email: String!, password: String!, cnop: String, role: String!, avatar: String, hospital: String! ):String!
    signIn( email: String!, password: String!): String!

  }
`;

