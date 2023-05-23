import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: {unique: true}    
    },
    address:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    logo:{
        type: String,
        required: false
    },
    category:{
        type: String,
        required: true
    },
    user:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    }]
},{
    timestamps: true
})

const Hospitals = mongoose.model('Hospitals', hospitalSchema)

export default Hospitals