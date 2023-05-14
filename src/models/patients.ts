import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    middle_name: {
      type: String,
      required: false,
    },
    last_name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: false,
    },
    street_address: {
      type: String,
      required: true,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    code: {
      type: String,
      required: true,
      index: { unique: true },
    },
    patient_phone_number: {
      type: String,
      required: false,
    },
    contact_person: {
      type: String,
      required: false,
    },
    contact_person_phone_number: {
      type: String,
      required: false,
    },
    avatar: {
      data: Buffer,
      contentType: String,
    },
    hospital: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospitals",
      },
    ],
    id_card:{
        type: String,
        required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Patients = mongoose.model('Patients', patientSchema)

export default Patients