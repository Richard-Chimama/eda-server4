import mongoose from "mongoose"

const commentsSchema = new mongoose.Schema({
    comment: {
        type : String,
        required: false
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Posts"
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users"
    }
},
{
    timestamps: true
})

const Comments = mongoose.model('Comments', commentsSchema)
export default Comments