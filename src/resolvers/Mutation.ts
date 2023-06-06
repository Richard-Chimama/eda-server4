import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { GraphQLError } from 'graphql';
import dotenv from "dotenv"
import {createWriteStream } from "fs";
import { resolve } from "path";


dotenv.config()

const JWT_SECRETE:any = "edaprojectformybrother"

export const Mutation = {
  newHospital: async (
    parent: any,
    args: any,
    { models, user, clound }: { models: any; user: any, clound:any }
  ) => {

    const checkHospital = await models.hospitals.findOne({ 
      $or: [{name: args.name.trim().toLowerCase()}]
    })

    if(checkHospital){
      throw new GraphQLError("hospital name already exist")
    }else{
      const {filename, createReadStream} = await args.logo;

      const stream = createReadStream()

     // Generate a temporary file path
    const filePath = resolve(`./logo/${filename}`);

    // Create a writable stream to save the file temporarily
    const writeStream = createWriteStream(filePath);
    await new Promise((resolve, reject) => {
      // Pipe the data from the ReadStream to the WriteStream
      stream.pipe(writeStream)
        .on('finish', resolve)
        .on('error', reject);
    });

  
     const logo = await clound.uploader.upload(filePath, {
       resource_type: "auto",
     });

      const hospital = await models.hospitals.create({
        name: args.name.trim().toLowerCase(),
        address: args.address.trim(),
        city: args.city,
        logo: logo.url,
        category: args.category.trim().toLowerCase(),
        user: "644e4dbb74c80833df3b3f8b"
      });


      return hospital
    }

  },
  updateHospital: async (
    parent: any,
    {
      id,
      name,
      address,
      city,
    }: { id: any; name: any; address: any; city: any },
    { models, user }: { models: any; user: any }
  ) => {
    if (!user) {
      throw new GraphQLError("You must be signed in to update a hospital");
    }

    const findUser = await models.hospitals.findById(id);
    if (findUser && String(findUser.owner) !== user.id) {
      throw new GraphQLError("You don't have permission to update", {
        extensions: {
          code: "UNAUTHORIZED",
        },
      });
    }

    return await models.hospitals.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          name,
          address,
          city,
        },
      },
      {
        new: true,
      }
    );
  },
  deleteHospital: async (
    parent: any,
    args: any,
    { models, user }: { models: any; user: any }
  ) => {
    if (!user) {
      throw new GraphQLError("You must be signed in to delete a hospital");
    }
    const findUser = await models.hospitals.findById(args.id);
    if (findUser && String(findUser.owner) !== user.id) {
      throw new GraphQLError("You don't have permission to delete", {
        extensions: {
          code: "UNAUTHORIZED",
        },
      });
    }
    try {
      await models.hospitals.findOneAndRemove({ _id: args.id });
      return true;
    } catch (err) {
      return false;
    }
  },

  //authotetication signup
  signUp: async (
    parent: any,
    { username, email, password, avatar, role, cnop, hospital }:{username:string, email:any, password:any,avatar:any, role:any, hospital:any, cnop:any},
    { models, clound }: { models: any, clound:any }
  ) => {
    email = email.trim().toLowerCase();
    const hashed = await bcrypt.hash(password, 10);
    const emailHashed = await bcrypt.hash(email,10)
    const checkUser = await models.Users.findOne({
      $or: [{ email: email}]
    })


    const {filename, createReadStream} = await avatar 
    const stream = createReadStream()

    const filePath = resolve(`./upload/${filename}_${emailHashed}`)

    const writeStream = createWriteStream(filePath)
    await new Promise((resolve, reject) =>{
      stream.pipe(writeStream)
        .on('finish', resolve)
        .on('error', reject);
    })

    const photo = await clound.uploader.upload(filePath, {resource_type: "auto"})

    //if the user is found, throw authentication error
    if(checkUser) {
      throw new GraphQLError("email already registered")
    }else{
        try {
          const user = await models.Users.create({
            username,
            email,
            password: hashed,
            role,
            avatar: photo.url,
            cnop,
            hospital,
          });

          await models.hospitals.findOneAndUpdate({
            _id: hospital
          },{
            $set:{
              user: user._id
            },
          },{
              new: true
            }
          )

          const expiresInDays = 1;
          const expirationTime = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;
      
          const payload = {
            userId: user._id,
            exp: expirationTime,
          }
    
          return jwt.sign(payload, JWT_SECRETE);
        } catch (err) {
          console.log(err);
          throw new Error("Error creating account");
        }

    }

  },

  //signin
  signIn: async (
    parent: any,
    { email, password }: { email: any; password: any },
    { models }: { models: any }
  ) => {
    if (email) {
      email = email.trim().toLowerCase();
    }

    const user = await models.Users.findOne({
      //{username: emaill} will enable to sign user based on
      // their username
      $or: [{ email: email }],
    });
    //if no user is found, throw an authentication error
    if (!user) {
      throw new GraphQLError("Error siging in");
    }

    //if the passwords doesn't much, throw an authentication error
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new GraphQLError("Error signing in");
    }

    // Expiration time in seconds (e.g., 1 days)
    const expiresInDays = 1;
    const expirationTime = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;

    const payload = {
      userId: user._id,
      exp: expirationTime,
    }

    //create and return the json web token
    return jwt.sign(payload, JWT_SECRETE);
  }, //end of signing in

  //create a patient
  newPatient: async(parent:any, args:any, {models, user, clound}:{models:any, user:any, clound:any})=>{

    if (!user) {
      throw new GraphQLError("You must be signed in to register a patient");
    }

    const {filename, createReadStream} = await args.avatar;
    //const filename = uuidv4(); // Generate a unique filename
    const stream = createReadStream()

     // Generate a temporary file path
    const filePath = resolve(`./upload/${filename}`);
  
  // Create a writable stream to save the file temporarily
    const writeStream = createWriteStream(filePath);
    await new Promise((resolve, reject) => {
      // Pipe the data from the ReadStream to the WriteStream
      stream.pipe(writeStream)
        .on('finish', resolve)
        .on('error', reject);
    });

  
   const photo = await clound.uploader.upload(filePath, {resource_type: "auto"})

    try{
      const newPatient = await models.Patients.create({
        first_name: args.first_name.trim().toLowerCase(),
        middle_name: args.middle_name.trim().toLowerCase(),
        last_name: args.last_name.trim().toLowerCase(),
        gender: args.gender,
        area: args.area.trim().toLowerCase(),
        street_address: args.street_address.trim().toLowerCase(),
        date_of_birth: args.date_of_birth,
        code: args.code,
        patient_phone_number: args.patient_phone_number.trim(),
        contact_person: args.contact_person.trim().toLowerCase(),
        contact_person_phone_number: args.contact_person_phone_number,
        avatar: photo.url,
        hospital: args.hospital,
        id_card: args.id_card.trim(),
      })
      return newPatient
    }catch(err){
      //console.error(err)
      throw new GraphQLError("Failed to register the patient information")
    }
  },
  deletePatient: async(parent:any, args:any,{models, user}:{models:any, user:any}) => {
    if(!user){
      throw new GraphQLError("You must signin to submit a fich")
    }
    try{
      await models.Patients.findOneAndRemove({_id: args.id})
      return true
    }catch(err){
      return false
    }
  },
  newFiche: async(parent:any, args:any,{models, user}:{models:any,user:any}) =>{
    if(!user){
      throw new GraphQLError("You must signin to submit a fich")
    }

    try{
      const newFiche = await models.Form_attendance.create({
        allergie: args.allergie,
        intoxication: args.intoxication,
        atcd_chirurgicaux: args.atcd_chirurgicaux,
        atcd_medicaux: args.atcd_medicaux,
        rh: args.rh,
        gs: args.gs,
        pouls: args.pouls,
        temperature: args.temperature,
        poids: args.poids,
        taille: args.taille,
        ta: args.ta,
        observations: args.observations,
        prescription: args.prescription,
        patient: args.patient,
        users: args.user
      })
      return newFiche
    }catch(err){
      console.error(err)
      throw new GraphQLError("Failed to register the patient fiche")
    }
  },
  updateFiche:  async(parent:any, args:any,{models, user}:{models:any,user:any}) =>{
    if (!user) {
      throw new GraphQLError("You must be signed in to update a hospital");
    }

    try{
      const formAttendance = await models.Form_attendance.findById(args.id);
      formAttendance.users.push(user.id);


     return await models.Form_attendance.findOneAndUpdate(
        {
          _id: args.id,
        },
        {
          $set:{
           /*  allergie: args.allergie,
            intoxication: args.intoxication,
            atcd_chirurgicaux: args.atcd_chirurgicaux,
            atcd_medicaux: args.atcd_medicaux,
            rh: args.rh,
            gs: args.gs,
            pouls: args.pouls,
            temperature: args.temperature,
            poids: args.poids,
            taille: args.taille,
            ta: args.ta,
            observations: args.observations, */
            prescription: args.prescription,
          }
        },{
          new: true
        }
      )

    }catch(err:any){
      throw new Error(err)
    }

    
  }


};//end of the Mutation







