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
    id_card: String!
    first_name: String!
    middle_name: String
    last_name: String!
    gender: String!
    area: String!
    street_address: String!
    date_of_birth: DateTime!
    code: String!
    patient_phone_number: String
    contact_person: String
    contact_person_phone_number: String
    avatar: Upload
    hospital: [Hospital]
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
    observations: String
    prescription: String
    createdAt: DateTime!
    updatedAt: DateTime!
    patient: Patients!
    users: [Users]
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
    logout: Boolean!

    #Patients query
    patients: [Patients!]!
    patient(id: String!): Patients

    #Fiche
    form_attendances: [Form_attendance]!
    form_attendance(id: ID!): Form_attendance!
  }

  type Mutation{
    #Hospitals mutations
    newHospital(name: String!, address: String!, city:String!, category:String!, user: String): Hospital!
    updateHospital(id: ID!, name: String, address: String, city:String,  user:String): Hospital
    deleteHospital(id: ID!): Boolean!

    #Users
    signUp(username: String!, email: String!, password: String!, cnop: String, role: String!, avatar: String, hospital: String! ):String!
    signIn( email: String!, password: String!): String!


    #Patients mutaions
    newPatient(id_card: String!, first_name: String!,middle_name:String, last_name: String!, gender: String!, area: String, 
                street_address: String!, date_of_birth: DateTime !, code: String!, patient_phone_number: String,
                contact_person: String, contact_person_phone_number: String, avatar:Upload, hospital: String): Patients!
    deletePatient(id:ID!): Boolean!

    #new form the attendance
    newFiche(allergie:String, intoxication: String, atcd_chirurgicaux: String, atcd_medicaux: String,
            rh: String, gs: String, pouls: String, temperature: String, poids: String, taille: String,
            ta:String, observations: String, prescription: String, patient:String!): Form_attendance!
    updateFiche(allergie:String, intoxication: String, atcd_chirurgicaux: String, atcd_medicaux: String,
            rh: String, gs: String, pouls: String, temperature: String, poids: String, taille: String,
            ta:String, observations: String, prescription: String, patient:String!): Form_attendance!

  }
`;

