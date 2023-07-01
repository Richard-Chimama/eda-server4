import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { GraphQLError } from 'graphql';
import dotenv from "dotenv"
import { PHOTO_UPLOAD } from "../Functions/Utilities.js";


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
      

      try{
        const hospital = await models.hospitals.create({
          name: args.name.trim().toLowerCase(),
          address: args.address.trim(),
          city: args.city,
          logo: args.logo ? await PHOTO_UPLOAD(clound, args.logo) : null,
          category: args.category.trim().toLowerCase(),
          user: null,
          patients: null,
          patientNotification: null
        });
  
  
        return hospital

      }catch(err){
        console.log(err)
        throw new GraphQLError("Failed to register the hospital")
      }


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
    { username, email, postsNotification, password, avatar, role, cnop, hospital, id_card }:{username:string, email:any, password:any,avatar:any, role:any, id_card:any,postsNotification:any, hospital:any, cnop:any},
    { models, clound }: { models: any, clound:any }
  ) => {
    email = email.trim().toLowerCase();
    const hashed = await bcrypt.hash(password, 10);
    //const emailHashed = await bcrypt.hash(email,10) not using it for now
    const checkUser = await models.Users.findOne({
      $or: [{ email: email}]
    })

    //if the user is found, throw authentication error
    if(checkUser) {
      throw new GraphQLError("email already registered")
    }else{
        try {
          const user = await models.Users.create({
            username,
            id_card,
            email,
            password: hashed,
            role,
            avatar: avatar? await PHOTO_UPLOAD(clound, avatar): null,
            cnop,
            hospital,
            postsNotification,
          });

          const Hospital =  await models.hospitals.findOne({_id: hospital})

          if(Hospital.user === null){
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
          }else{
            Hospital.user.push(user._id)
            await Hospital.save()
          }


          const expiresInDays = 1;
          const expirationTime = Math.floor(Date.now() / 1000) + expiresInDays * 24 * 60 * 60;
      
          const payload = {
            userId: user._id,
            exp: expirationTime,
          }
    
          return `${jwt.sign(payload, JWT_SECRETE)} ${user._id}`;
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
  deleteUser:async(parent:any, args:any, {models, user, clound}:{models:any, user:any, clound:any})=>{
    if(!user){
      throw new GraphQLError("you must be signin to delete the user")
    }
    try{
      await models.Users.findOneAndRemove({_id: args.user})
      return true
    }catch(error){
      return false
    }
  },
  updateUserRole:async(parent:any, args:any, {models, user, clound}:{models:any, user:any, clound:any})=>{
    if (!user) {
      throw new GraphQLError("You must be signed in to update user information");
    }

    try{
      const updateUserRole = await models.Users.findOneAndUpdate({
        _id: args.user
      },{
        $set:{
          role:args.role
        }
      },{
        new: true
      })

      return updateUserRole

    }catch(error){
      console.log(error)
      throw new GraphQLError("Failed to update user information!")
    }
  },
  //create a patient
  newPatient: async(parent:any, args:any, {models, user, clound}:{models:any, user:any, clound:any})=>{

    if (!user) {
      throw new GraphQLError("You must be signed in to register a patient");
    }

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
        avatar: args.avatar? await PHOTO_UPLOAD(clound, args.avatar) : null,
        hospital: args.hospital,
        id_card: args.id_card.trim(),
      })

      const Hospital = await models.hospitals.findOne({_id: args.hospital}) 
      
      if(Hospital.patients === null){
        await models.hospitals.findOneAndUpdate({
          _id: args.hospital
        },{
          $set:{
            patients: [newPatient._id]
          },
        },{
            new: true
          }
        )
    }else{
      Hospital.patients.push(newPatient._id)
      await Hospital.save()
    }

      return newPatient
    }catch(err){
      console.error(err)
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
  newFiche: async(parent:any, args:any,{models, user, pubsub}:{models:any,user:any, pubsub}) =>{
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
        hospital: args.hospital,
        users: args.user
      })

      const notification = await models.PatientNotification.create({
        message: `une nouvelle fiche de consultation`,
        patient: args.patient
      })

      pubsub.publish(`ROOM${args.hospital}`, {notification: notification})

      const Hospital = await models.hospitals.findOne({_id: args.hospital}) 
      if(Hospital.patientNotification === null){
        await models.hospitals.findOneAndUpdate({
          _id: args.hospital
        },{
          $set:{
            patientNotification: notification._id
          },
        },{
            new: true
          }
        )
    }else{
      Hospital.patientNotification.push(notification._id)
      await Hospital.save()
    }



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
  },
  newEvent: async(parent:any, args:any,{models, user}:{models:any,user:any})=>{
    if (!user) {
      throw new GraphQLError("You must be signed in to create an event");
    }

    try{
      const newEvent = await models.Calendar.create({
        title: args.title,
        desc: args.desc,
        start: args.start,
        end: args.end,
        hospital: args.hospital,
        user: args.user
      })

      return newEvent

    }catch(err){
      throw new GraphQLError("failed to create a calendar event!")
    }

  },
  new_lab_fiche: async(parent:any, args:any,{models, user, pubsub}:{models:any,user:any, pubsub:any})=>{
    if (!user) {
      throw new GraphQLError("You must be signed in");
    }
    try{
      const newLab = await models.Lab.create({
        h_pyloria: args.h_pyloria,
        gb: args.gb,
        fl: args.fl,
        gr: args.gr,
        hb: args.hb,
        hct: args.hct,
        vs: args.vs,
        frottis_vaginal: args.frottis_vaginal,
        temps_saignement: args.temps_saignement,
        temps_coagulation: args.temps_coagulation,
        plq_sanguine: args.plq_sanguine,
        autres: args.autres,
        ex_direct: args.ex_direct,
        enrichissement: args.enrichissement,
        sediment_urinaire: args.sediment_urinaire,
        sucre: args.sucre,
        albuminurie: args.albuminurie,
        gram: args.gram,
        ziell: args.ziell,
        encre_chine: args.encre_chine,
        hemoculture_ab: args.hemoculture_ab,
        coproculture_ab: args.coproculture_ab,
        uroculture_ab: args.uroculture_ab,
        spermatogramme: args.spermatogramme,
        fv: args.fv,
        widal: args.widal,
        hiv: args.hiv,
        t_covid: args.t_covid,
        groupe_sanguin: args.groupe_sanguin,
        test_grossesse: args.test_grossesse,
        rpr: args.rpr,
        hbs_ag: args.hbs_ag,
        hepati_b: args.hepati,
        gs: args.gs,
        rh: args.rh,
        compatibilite: args.compatibilite,
        electrophose: args.electrophose,
        test_emmel: args.test_emmel,
        glycemie: args.glycemie,
        uree: args.uree,
        creatinine: args.creatinine,
        lipides_totaux: args.lipides_totaux,
        cholesterol: args.cholesterol,
        acide_urique: args.acide_urique,
        triglyceride: args.triglyceride,
        bil_t: args.bil_t,
        bil_d: args.bil_d,
        bil_l: args.bil_l,
        cnol_total: args.cnol_total,
        sgot: args.sgot,
        sgpt: args.sgpt,
        prot_24h: args.prot_24h,
        proteine_t: args.proteine_t,
        calcemie: args.calcemie,
        potassium: args.potassium,
        sodium: args.sodium,
        magnesium: args.magnesium,
        chlore: args.chlore,
        glycosurie: args.glycosurie,
        proteinuire: args.proteinuire,
        lcr: args.lcr,
        patient: args.patient,
        hospital: args.hospital,
        users: args.users,
        ge: args.ge,
        gf: args.gf,
        snip: args.snip,
        sang_autres: args.sang_autres,
      });

      const notification = await models.PatientNotification.create({
        message: `une nouvelle fiche de laboratoire`,
        patient: args.patient
      })

      pubsub.publish(`ROOM${args.hospital}`, {notification: notification})


      const Hospital = await models.hospitals.findOne({_id: args.hospital}) 
      if(Hospital.patientNotification === null){
        await models.hospitals.findOneAndUpdate({
          _id: args.hospital
        },{
          $set:{
            patientNotification: notification._id
          },
        },{
            new: true
          }
        )
        }else{
          Hospital.patientNotification.push(notification._id)
          await Hospital.save()
        }
    
      return newLab
    }catch(err){
      throw new GraphQLError("failed to create new lab fiche")
    }
  },
  new_fiche_prenatale: async(parent:any, args:any,{models, user, pubsub}:{models:any,user:any, pubsub:any})=>{
    if (!user) {
      throw new GraphQLError("You must be signed in");
    }
    try{
      const new_fiche_prenatale = await models.Fiche_prenatale.create({
        ddr: args.ddr,
        dpa: args.dpa,
        above19: args.above19,
        above15: args.above15,
        tbc: args.tbc,
        hta: args.hta,
        scass: args.scass,
        dbt: args.dbt,
        car: args.car,
        raa: args.raa,
        syphylis: args.syphylis,
        vihsida: args.vihsida,
        viol: args.viol,
        pep: args.pep,
        fobrome_uterin: args.fobrome_uterin,
        fracture_bassin: args.fracture_bassin,
        patient: args.patient,
        hospital: args.hospital,
        users: args.users
      })

      const notification = await models.PatientNotification.create({
        message: `une nouvelle fiche de consultation prenatale`,
        patient: args.patient
      })

      pubsub.publish(`ROOM${args.hospital}`, {notification: notification})


      const Hospital = await models.hospitals.findOne({_id: args.hospital}) 
      if(Hospital.patientNotification === null){
        await models.hospitals.findOneAndUpdate({
          _id: args.hospital
        },{
          $set:{
            patientNotification: notification._id
          },
        },{
            new: true
          }
        )
    }else{
      Hospital.patientNotification.push(notification._id)
      await Hospital.save()
    }

      return new_fiche_prenatale
    }catch(err){
      console.log(err)
      throw new GraphQLError("failed to create fiche prenatale")
    }
  },
  publishGreeting: async(parent:any, args:any,{models, user, pubsub, clound}:{models:any,user:any, pubsub:any, clound:any}) =>{
    const greeting = 'Hello, everyone!'; // Replace with your desired greeting
      
      // Publish the greeting event to the subscription channel
      pubsub.publish('GREETING_CHANNEL', { greeting: greeting });
      
      return greeting;
  },
  new_posts: async(parent:any, args:any,{models, user,clound, pubsub}:{models:any,user:any, clound:any, pubsub:any}) =>{
    if (!user) {
      throw new GraphQLError("You must be signed in to create a post");
    }
    try{
      const post = await models.Posts.create({
        content: args.content,
        comments: args.comments,
        author: args.author,
        image: args.image ? await PHOTO_UPLOAD(clound, args.image): null,
        likes: args.likes,
        hospital: args.hospital,
      })

      pubsub.publish(`NEW_POST${args.hospital}`, {postsByHospital: post})

      try{
        const User = await models.Users.findOne({_id: args.author}) 
        if(User.postsNotification === null || User.postsNotification === undefined){
          await models.Users.findOneAndUpdate({
            _id :args.author},
            {
              $set:{
              postsNotification:[post._id]
              }
        },
          {
            new: true
          })
        }else{
          User.postsNotification.push(post._id)
          await User.save()
        }

      }catch(err){
        console.log(err)
        throw new GraphQLError("failed to update user post notification")
      } 

    

      return post
    }catch(err){
      console.log(err)
      throw new GraphQLError("Failed to create new post");
    }
  },
  new_comments: async(parent:any, args:any,{models, user,clound, pubsub}:{models:any,user:any, clound:any, pubsub:any})=>{
    if (!user) {
      throw new GraphQLError("You must be signed in to comment on a post");
    }
    try{
      const comment = await models.Comments.create({
        comment: args.comment,
        post: args.post,
        user: args.user
      })
      
      pubsub.publish(`NEW_COMMENT`, {newComment: comment})

      const Post = await models.Posts.findOne({_id: args.post})
      if(Post.comments === null){
        await models.Posts.findOneAndUpdate({_id :args.post},
          {
            $set:{
            comments:[comment._id]
        },},
        {
          new: true
        })
      }else{
        Post.comments.push(comment._id)
        await Post.save()
      }

      return comment

    }catch(err){
      throw new GraphQLError("Failed to create a new comment");
    }
  },
  createLikes: async(parent:any, args:any,{models, user,clound, pubsub}:{models:any,user:any, clound:any, pubsub:any})=>{
    if (!user) {
      throw new GraphQLError("You must be signed in to like on a post");
    }
    try{
      const like = await models.Likes.create({
        user: args.user,
        posts: args.posts,
        likes: args.posts,
      })

      const Post = await models.Posts.findOne({_id: args.posts})
      if(Post.likes=== null){
        await models.Posts.findOneAndUpdate({_id :args.posts},
          {
            $set:{
            likes:[like._id]
        },},
        {
          new: true
        })
      }else{
        Post.likes.push(like._id)
        await Post.save()
      }

      return like
    }catch(err){
      throw new GraphQLError("Failed to create a new like");
    }
  }


};//end of the Mutation







