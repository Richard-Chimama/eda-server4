import mongoose from 'mongoose';

//create a posts schema
const postsSchema = new mongoose.Schema({
    content: {
        type : String, 
        required : true
    },
    author:{
        type : mongoose.Schema.Types.ObjectId, 
        ref:'Users' 
    },
    image:{
        type :String, 
        required: false
    },
    likes:[{
        type : mongoose.Schema.Types.ObjectId,
        ref: "Likes",
        default: null
    }],
    comments:[{
        type : mongoose.Schema.Types.ObjectId,
        ref:"Comments",
        default: null
    }],
    hospital: {
        type : mongoose.Schema.Types.ObjectId, 
        ref:'Hospitals',
    }
    

},{
    timestamps:true  //automatically adds createdAt and updatedAt fields to the model
})

const Posts = mongoose.model('Posts', postsSchema)

export default Posts