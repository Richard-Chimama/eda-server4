// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = `#graphql
  scalar DateTime
  scalar Upload


 #define the registered staff in the hospital
  type Users{
    id: ID!,
    id_card: String
    username: String
    email: String!
    avatar: Upload
    cnop: String
    password: String!
    role: String
    hospital: [Hospital]
    postsNotification: [Posts]
  }

  type Hospital{
    id: ID,
    name: String!
    address: String!
    city: String!
    logo: Upload
    user: [Users]
    patientNotification: [PatientNotification]
    patients: [Patients]
    category: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type PatientNotification{
    id: ID!
    message: String!
    patient: Patients!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Posts{
    id: ID!
    content: String!
    image: Upload 
    author: Users!
    comments:[Comments!]
    likes:[Likes!]
    createdAt: DateTime!
    updatedAt: DateTime!
    hospital: Hospital!
  }

  type Comments{
    id: ID
    comment:String!
    post:Posts!
    user:Users!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Likes{
    id:ID!
    like:Boolean!
    user:Users!
    posts:Posts!
  }


  type Lab{
    id: ID!,
    h_pyloria: String,
    gb: String,
    fl: String,
    gr: String,
    hb: String,
    hct: String,
    vs: String,
    frottis_vaginal: String,
    temps_saignement: String,
    temps_coagulation: String,
    plq_sanguine: String,
    autres: String,
    ex_direct: String,
    enrichissement: String,
    sediment_urinaire: String,
    sucre: String,
    albuminurie: String,
    gram: String,
    ziell: String,
    encre_chine: String,
    hemoculture_ab: String,
    coproculture_ab: String,
    uroculture_ab: String,
    spermatogramme: String,
    fv: String,
    widal: String,
    hiv: String,
    t_covid: String,
    groupe_sanguin: String,
    test_grossesse: String,
    rpr: String,
    hbs_ag: String,
    hepati_b: String,
    gs: String,
    rh: String,
    compatibilite: String,
    electrophose: String,
    test_emmel: String,
    glycemie: String,
    uree: String,
    creatinine: String,
    lipides_totaux: String,
    cholesterol: String,
    acide_urique: String,
    triglyceride: String,
    bil_t: String,
    bil_d: String,
    bil_l: String,
    cnol_total: String,
    sgot: String,
    sgpt: String,
    prot_24h: String,
    proteine_t: String
    calcemie: String,
    potassium: String,
    sodium: String,
    magnesium: String,
    chlore: String,
    glycosurie: String,
    proteinuire: String,
    lcr: String,
    createdAt: DateTime!
    updatedAt: DateTime!
    patient: Patients!,
    hospital: Hospital,
    users: [Users],
    ge: String,
    gf: String,
    snip:String,
    sang_autres: String
  }

  type Fiche_prenatale {
    id: ID!
    ddr: DateTime
    dpa: DateTime
    above19: Boolean
    above15: Boolean
    tbc: Boolean
    hta: Boolean
    scass: Boolean
    dbt: Boolean
    car: Boolean
    raa: Boolean
    syphylis: Boolean
    vihsida: Boolean
    viol: Boolean
    pep: Boolean
    fobrome_uterin: Boolean
    fracture_bassin: Boolean
    createdAt: DateTime!
    updatedAt: DateTime!
    patient: Patients!,
    hospital: Hospital,
    users: [Users],
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
    hospital: Hospital!
    users: [Users]
  }

  type Calendar{
    id: ID!
    title: String!
    desc: String
    start: DateTime!
    end: DateTime!
    hospital: Hospital
    user: Users
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
    patientByHospital(hospitalId: String!): [Patients!]!

    #Fiche
    form_attendances: [Form_attendance]!
    form_attendance(id: ID!): Form_attendance!

    #Calendar
    calendar_by_hospital(hospitalId:String!): [Calendar]!

    #Lab
    lab_by_hospital(hospitalId:String!): [Lab]!
    lab_by_patient(patientId:String!): [Lab]!
    lab: [Lab]!

    #Fiche prenatale
    fiche_prenatale(patientId:String!): [Fiche_prenatale]!

    #posts by the hospital
    postsByHospital(hospitalId:String!):[Posts]!
  }

  type Mutation{
    #Hospitals mutations
    newHospital(name: String!, address: String!, city:String!, logo:Upload, category:String!, user: String, patientNotification: String, patients: String): Hospital!
    updateHospital(id: ID!, name: String, address: String, city:String,  user:String): Hospital
    deleteHospital(id: ID!): Boolean!

    #Users
    signUp(username: String!, email: String!,  id_card: String, password: String!, cnop: String, role: String!, avatar: Upload, hospital: String, postsNotification:String ):String!
    signIn( email: String!, password: String!): String!
    deleteUser(user:String!): Boolean!
    updateUserRole(user:String!, role: String!): Users!


    #Patients mutaions
    newPatient(id_card: String!, first_name: String!,middle_name:String, last_name: String!, gender: String!, area: String, 
                street_address: String!, date_of_birth: DateTime !, code: String!, patient_phone_number: String,
                contact_person: String, contact_person_phone_number: String, avatar:Upload, hospital: String): Patients!
    deletePatient(id:ID!): Boolean!

    #new form the attendance
    newFiche(allergie:String, intoxication: String, atcd_chirurgicaux: String, atcd_medicaux: String,
            rh: String, gs: String, pouls: String, temperature: String, poids: String, taille: String,
            ta:String, observations: String, prescription: String, user: String!, hospital: String!, patient:String!): Form_attendance!
    updateFiche(id:String!, prescription: String): Form_attendance!


    #new events in the calendar
    newEvent(start: DateTime!, end: DateTime!, title: String!, desc: String, hospital:String!, user: String!): Calendar!
    

    #Lab
    new_lab_fiche(h_pyloria: String, gb: String, fl: String, gr: String, hb: String, hct: String, vs: String, frottis_vaginal: String,
          temps_saignement: String, temps_coagulation: String, plq_sanguine: String, autres: String, ex_direct: String, enrichissement: String,
          sediment_urinaire: String, sucre: String, albuminurie: String, gram: String, ziell: String, encre_chine: String,
          hemoculture_ab: String, coproculture_ab: String, uroculture_ab: String, spermatogramme: String, fv: String, widal: String,
          hiv: String, t_covid: String, groupe_sanguin: String, test_grossesse: String, rpr: String, hbs_ag: String, hepati_b: String,
          gs: String, rh: String, compatibilite: String, electrophose: String, test_emmel: String, glycemie: String, uree: String,
          creatinine: String, lipides_totaux: String, cholesterol: String, acide_urique: String, triglyceride: String, bil_t: String,
          bil_d: String, bil_l: String, cnol_total: String, sgot: String, sgpt: String, prot_24h: String, proteine_t: String, calcemie: String,
          potassium: String, sodium: String, magnesium: String, chlore: String, glycosurie: String, proteinuire: String, lcr: String,patient: String!,
          hospital: String!, users: String!, ge: String, gf: String, snip: String, sang_autres: String): Lab!


  #Fiche Prenatale
  new_fiche_prenatale(ddr: DateTime!, dpa: DateTime!, above19: Boolean, above15: Boolean,
          tbc: Boolean, hta: Boolean, scass: Boolean, dbt: Boolean, car: Boolean, raa: Boolean,
          syphylis: Boolean, vihsida: Boolean, viol: Boolean, pep: Boolean, fobrome_uterin: Boolean,
          fracture_bassin: Boolean, patient: String!,
          hospital: String!, users: String!): Fiche_prenatale!

  publishGreeting: String
  
    #new Posts
    new_posts(content: String!, image: Upload, author: String!, comments: String, likes: String, hospital: String!): Posts!
    delete_post(postId:String!): Boolean!
    new_comments(comment: String, post: String, user: String): Comments!
    createLikes(like: Boolean!, user: String!, posts: String!): Likes!
  }

type Subscription{
  greeting(data:String): String
  notification(hospitalId:String!): PatientNotification!
  postsByHospital(hospitalId:String!): Posts!
  newComment(postId:String!): Comments!
}

`;

