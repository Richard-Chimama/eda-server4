import { withFilter } from "graphql-subscriptions/dist/index.js"


export const Subscription ={
    greeting: {
        subscribe: (parent:any, args:any, {models, pubsub}:{models:any, pubsub:any})=> pubsub.asyncIterator(['GREETING_CHANNEL'])
    },
    notification: {
        subscribe:(parent:any, args:any, {models, pubsub}:{models:any, pubsub:any})=> pubsub.asyncIterator([`ROOM${args.hospitalId}`]),
        resolve: async(payload:any, args: any, {models, pubsub}:{models:any, pubsub:any})=>{
            const populatedNotification = await models.PatientNotification.findById(payload.notification._id).populate([{path:"patient", model:"Patients"}])
            return populatedNotification
        }
    },
    postsByHospital:{
        subscribe: withFilter(
            (parent:any, args:any, {models, pubsub}:{models:any, pubsub:any})=> pubsub.asyncIterator([`NEW_POST${args.hospitalId}`]),
            async(payload, variables)=> payload.postsByHospital.hospital === variables.hospitalId
        )
    },
    newComment:{
        subscribe: (parent:any, args:any, {models, pubsub}:{models:any, pubsub:any})=> {
            return pubsub.asyncIterator([`NEW_COMMENT`])
        },
        resolve: async(payload:any, args: any, {models, pubsub}:{models:any, pubsub:any})=>{
              return payload.newComment.populate([{path:"post", model:"Posts"},{path:"user",model:"Users"}])
              
        }
    }

}