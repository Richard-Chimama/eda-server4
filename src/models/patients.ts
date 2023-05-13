import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
   
},{
    timestamps: true
})

const Patients = mongoose.model('Patients', patientSchema)

export default Patients