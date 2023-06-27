import mongoose from "mongoose"

const FichePrenatale = new mongoose.Schema({
    ddr: {type: Date, required: false},
    dpa: {type: Date, required: false},
    above19: {type: Boolean, required: false},
    above15: {type: Boolean, required: false},
    tbc: {type: Boolean, required: false},
    hta: {type: Boolean, required: false},
    scass: {type: Boolean, required: false},
    dbt: {type: Boolean, required: false},
    car: {type: Boolean, required: false},
    raa: {type: Boolean, required: false},
    syphylis: {type: Boolean, required: false},
    vihsida: {type: Boolean, required: false},
    viol: {type: Boolean, required: false},
    pep: {type: Boolean, required: false},
    fobrome_uterin: {type: Boolean, required: false},
    fracture_bassin: {type: Boolean, required: false},
    patient: {type:mongoose.Schema.Types.ObjectId, ref: "Patients"},
    hospital: {type:mongoose.Schema.Types.ObjectId, ref:"Hospitals"},
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }]
},
{
    timestamps: true
})

const Fiche_prenatale = mongoose.model('Fiche_prenatale', FichePrenatale)
export default Fiche_prenatale