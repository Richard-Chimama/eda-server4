import { GraphQLError } from "graphql"

interface Params{
    models:any,
    user:any
}

export const Query = {
    hospitals: async (parent:any, args:any, {models}:{models:any})=> {
        const hospitals = await models.hospitals.find().limit(100)
        const bindedHospitalsUsers = hospitals.map((item:any, index:number)=>{
            const hospital = item.populate("user")
                .then((user:any) => user)
                .catch((error:any) => console.log(error))

            return hospital
        })

        return bindedHospitalsUsers
    },
    hospital: async (parent:any, args:any, {models, user}:{models:any, user:any})=>{
        if(!user){
            throw new GraphQLError("You must sign in")
        }
      const getHospital = await models.hospitals.findById(args.id);
      const hospitalBindedUser = getHospital
        .populate("user")
        .then((user: any) => user)
        .catch((error: any) => console.log(error));

      return hospitalBindedUser;
    },
    checkHospital: async (parent:any, args:any, {models}:Params)=> {
        const check = await models.hospitals.findOne({
            $or: [{name: args.name}]
        })
        if(!check){
            return false
        }else{
            return true
        }
    },
    users: async (parent:any, args:any, {models, user}:{models:any, user: any})=>{ 
        if(!user){
            throw new GraphQLError("You must sign in")
        }
       const users = await models.Users.find().limit(100)
       const bindUserHospital = await users.map((item:any)=>{
        const user = item.populate("hospital")
        .then((hospital:any)=> hospital)
        .catch((error:any)=>console.log(error))

        return user
       })
       return bindUserHospital;
    },
    user: async(parent:any, args:any, {models}:{models:any})=> {
        const user = await models.Users.findOne({
            $or:[{email:args.email}]
        })
       if (!user) {
        throw new GraphQLError("Error user not found!!");
      }
        const userBindHospital = user
          .populate("hospital")
          .then((hospital: any) => hospital)
          .catch((error: any) => console.log(error));

        return userBindHospital
    },
    me: async (parent:any, args:any, {models, user}:{models:any, user:any})=> {
        if(!user){
            throw new GraphQLError("You must sign in")
        }
        const me = await models.Users.findById(user.id)
        const userBindHospital = me.populate("hospital")
        .then((hospital:any)=> hospital)
        .catch((error:any)=>console.log(error))

        return userBindHospital
    },
    patients: async(parent:any, args:any, {models}:{models:any})=>{
        const patients = await models.Patients.find().limit(100)
        const getPatientWithAllReferences = patients.map((patient:any) =>{
            const person = patient
              .populate([
                {
                  path: "hospital",
                  model: "Hospitals",
                }
              ])
              .then((client: any) => client)
              .catch((error: any) => console.error(error));
                return person
        })

        return getPatientWithAllReferences
    },
    patient: async(parent:any, args:any, {models, user}:{models:any, user:any})=>{
        if(!user){
            throw new GraphQLError("user not authenticated")
        }
        try{
            const patient = await models.Patients.findById(args.id)
            const person = patient.populate([
                {
                    path: "hospital",
                  model: "Hospitals",
                }
            ])
            .then((client: any) => client)
            .catch((error: any) => console.error(error));
        return person

        }catch(err:any){
            throw new GraphQLError(err.message)
        }
    },
    form_attendances: async(parent:any, args:any, {models, user}:{models:any, user:any})=>{
        if(!user){
            throw new GraphQLError("user not authenticated")
        }
        const fiches = await models.Form_attendance.find().limit()
        const fichWithAllReference = fiches.map((fiche:any)=>{
            const form = fiche.populate([
                {
                    path: "patient",
                    model: "Patients"
                },
                {
                    path: "users",
                    model: "Users"
                }
            ]).then((fich:any)=> fich)
                .catch((error: any) => console.error(error))
               return form
        })

        return fichWithAllReference;
    },
    form_attendance: async (parent:any, args:any, {models, user}:Params) => {
        if(!user){
            throw new GraphQLError("user not authenticated")
        }

        try{
            const fiche = await models.Form_attendance.findById(args.id)
            const form = fiche.populate([
                {
                    path: "patient",
                    model: "Patients"
                },
                {
                    path: "users",
                    model: "Users"
                }
            ]).then((fich:any)=> fich)
                .catch((error: any) => console.error(error))
                
            return form

        }catch(err){
            throw new GraphQLError("failed to return the fiche for the patient")
        }
    }

}
