import mongoose from "mongoose"

const likesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    posts:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Posts",
    },
    like:{
        type: Boolean,
        default: false,
    }
},{
    timestamps : true  //create a createdAt and updatedAt field in the database automatically
});


const Likes = mongoose.model('Likes', likesSchema)
export default Likes