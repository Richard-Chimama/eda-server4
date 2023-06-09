import mongoose from "mongoose";

const CalendarSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    desc:{
        type: String,
        required: false,
    },
    start:{
        type: Date,
        require: true
    },
    end:{
        type: Date,
        required: true
    },
    hospital:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hospitals'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }

})

const Calendar = mongoose.model('Calendar', CalendarSchema)
export default Calendar