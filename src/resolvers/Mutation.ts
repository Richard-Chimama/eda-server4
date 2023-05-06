import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { GraphQLError } from 'graphql';
import dotenv from "dotenv"

dotenv.config()

const JWT_SECRETE:any = "edaprojectformybrother"


export const Mutation = {
  newHospital: async (
    parent: any,
    args: any,
    { models, user }: { models: any; user: any }
  ) => {

    const checkHospital = await models.hospitals.findOne({ 
      $or: [{name: args.name.trim().toLowerCase()}]
    })

    if(checkHospital){
      throw new GraphQLError("hospital name already exist")
    }else{
      const hospital = await models.hospitals.create({
        name: args.name.trim().toLowerCase(),
        address: args.address,
        city: args.city,
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
    /*const findUser = await models.hospitals.findById(args.id);
    if (findUser && String(findUser.owner) !== user.id) {
      throw new GraphQLError("You don't have permission to delete", {
        extensions: {
          code: "UNAUTHORIZED",
        },
      });
    }*/
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
    { username, email, password, role, cnop, hospital }:{username:string, email:any, password:any, role:any, hospital:any, cnop:any},
    { models }: { models: any }
  ) => {
    email = email.trim().toLowerCase();
    const hashed = await bcrypt.hash(password, 10);
    const emailHashed = await bcrypt.hash(email,10)
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
            email,
            password: hashed,
            role,
            avatar:`https://www.gravatar.com/avatar/${emailHashed}`,
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
    
          return jwt.sign({ id: user._id }, JWT_SECRETE);
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

    //create and return the json web token
    return jwt.sign({ id: user._id }, JWT_SECRETE);
  }, //end of signing in
};//end of the Mutation



