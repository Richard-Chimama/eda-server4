// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = `#graphql
  scalar DateTime
  scalar Upload


 #define the registered staff in the hospital
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

  type Patients{
    id: ID!
    firstName: String!
    middleName: String
    secondName: String!
    gender: String!
    area: String!
    streetAddress: String!
    dateOfBirth: DateTime!
    age: String!
    code: String!
    patientPhoneNumber: String
    contactPerson: String
    contactPersonPhoneNumber: String
    avatar: Upload
    hospital: [Hospital]
    users: [Users]
    history: [Form_attendance]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Form_attendance{
    id: ID!
    allergie: String
    intoxication: String
    atcd_chirurgicaux: String
    atcd_medicaux: String
    rh: String
    gs: String
    pouls: String
    temperature: String
    poids: String
    taille: String
    ta:String
    onservations: String
    prescription: String
    createdAt: DateTime!
    updatedAt: DateTime!
    patient: Patients!

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
    user( email: String!): Users
    me: Users!

    #Patients query
    patients: [Patients!]!
    patient(code: String!): Patients
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

