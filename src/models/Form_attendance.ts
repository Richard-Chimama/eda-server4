import mongoose from "mongoose";

const form_attendance_Schema = new mongoose.Schema(
    {
        allergie:{ type: String, required: false},
        intoxication:{ type:String, required: false},
        atcd_chirurgicaux:{ type:String, required: false},
        atcd_medicaux:{ type:String, required: false},
        rh:{type:String, required: false},
        gs:{type:String, required: false},
        pouls:{type:String, required: false},
        temperature:{type:String, required: false},
        poids:{type:String, required: false},
        taille:{type:String, required: false},
        ta:{type:String, required: false},
        observations: {type:String, required: false},
        prescription: {type:String, required: false},
        patient:{type: mongoose.Schema.Types.ObjectId, ref: "Patients"},
        users: [{type: mongoose.Schema.Types.ObjectId, ref: "Users"}]
    },
    {
        timestamps: true,
      }
)




const Form_attendance = mongoose.model('Form_attendance', form_attendance_Schema)

export default Form_attendance

