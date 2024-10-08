import mongoose from "mongoose"

const labSchema = new mongoose.Schema({
    h_pyloria:{ type:String, required: false},
    gb:{ type: String, required: false},
    fl: {type: String, required: false},
    gr: {type: String, required: false},
    hb: {type: String, required: false},
    hct: {type:String, required: false},
    vs: {type:String, required: false},
    frottis_vaginal: {type:String, required: false},
    temps_saignement: {type:String, required: false},
    temps_coagulation: {type:String, required: false},
    plq_sanguine: {type:String, required: false},
    autres: {type:String, required: false},
    ex_direct: {type:String, required: false},
    enrichissement: {type:String, required: false},
    sediment_urinaire: {type:String, required: false},
    sucre: {type:String, required: false},
    albuminurie: {type:String, required: false},
    gram: {type:String, required: false},
    ziell: {type:String, required: false},
    encre_chine: {type:String, required: false},
    hemoculture_ab: {type:String, required: false},
    coproculture_ab: {type:String, required: false},
    uroculture_ab: {type:String, required: false},
    spermatogramme: {type:String, required: false},
    fv: {type:String, required: false},
    widal: {type:String, required: false},
    hiv: {type:String, required: false},
    t_covid: {type:String, required: false},
    groupe_sanguin: {type:String, required: false},
    test_grossesse: {type:String, required: false},
    rpr: {type:String, required: false},
    hbs_ag: {type:String, required: false},
    hepati_b: {type:String, required: false},
    gs: {type:String, required: false},
    rh: {type:String, required: false},
    compatibilite: {type:String, required: false},
    electrophose: {type:String, required: false},
    test_emmel: {type:String, required: false},
    glycemie: {type:String, required: false},
    uree: {type:String, required: false},
    creatinine: {type:String, required: false},
    lipides_totaux: {type:String, required: false},
    cholesterol: {type:String, required: false},
    acide_urique: {type:String, required: false},
    triglyceride: {type:String, required: false},
    bil_t: {type:String, required: false},
    bil_d: {type:String, required: false},
    bil_l: {type:String, required: false},
    cnol_total: {type:String, required: false},
    sgot: {type:String, required: false},
    sgpt: {type:String, required: false},
    prot_24h: {type:String, required: false},
    proteine_t: {type:String, required: false},
    calcemie: {type:String, required: false},
    potassium: {type:String, required: false},
    sodium: {type:String, required: false},
    magnesium: {type:String, required: false},
    chlore: {type:String, required: false},
    glycosurie: {type:String, required: false},
    proteinuire: {type:String, required: false},
    lcr: {type:String, required: false},
    ge: {type:String, required: false},
    gf: {type:String, required: false},
    snip: {type:String, required: false},
    sang_autres: {type:String, required: false},
    patient: {type:mongoose.Schema.Types.ObjectId, ref: "Patients"},
    hospital: {type:mongoose.Schema.Types.ObjectId, ref:"Hospitals"},
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }]

},{
    timestamps: true
})

const  Lab = mongoose.model('Lab', labSchema)

export default Lab