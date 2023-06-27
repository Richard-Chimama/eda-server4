import mongoose from "mongoose"

const notification = new mongoose.Schema({
    message:{type: String, required: false},
    patient: { type: mongoose.Schema.Types.ObjectId, ref:"Patients"},
    state:{type: Boolean, required: false}
},{
    timestamps: true
})

const PatientNotification = mongoose.model('PatientNotification', notification)

export default PatientNotification