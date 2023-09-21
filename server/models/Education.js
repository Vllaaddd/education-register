import mongoose, {Schema, model} from "mongoose";

const EducationModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    instructor: {
        type: String,
        required: true,
    },
    date:{
        type: String,
        required: true,
    },
    startTime:{
        type: String,
        required: true,
    },
    endTime:{
        type: String,
        required: true,
    },
    employees:{
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
        default: [],
    } 
}, {
    timestamps: true,
})

export default model('Education', EducationModel);