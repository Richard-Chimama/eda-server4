import mongoose from "mongoose";


const UserSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true
        },
        id_card:{
            type: String,
            required: true,
            index: {unique: true}
        },
        email: {
            type: String,
            required: true,
            index: { unique: true },
        },
        password: {
            type: String,
            required: true
        },
        role:{
            type: String,
            required: true,
        },
        cnop:{
            type: String,
            required: false
        },
        avatar:{
            type: String,
            required: false
        },
        postsNotification:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Posts"
        }],
        hospital:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hospitals"
        }]

    },{
        timestamps: true
    }
)

const Users = mongoose.model("Users", UserSchema )


export default Users