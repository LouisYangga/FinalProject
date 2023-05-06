const mongoose = require('mongoose');

const answersSchema = new mongoose.Schema({
    subjectId: {
        type: String,
        required: [true, "Please specify the subject's id"]
    },
    activityName: {
        type: String,
        required: [true, "Please specify the activity's name"]
    },
    activityType: {
        type: String
    },
    studentId: {
        type: String,
        required: [true, "Please specify the student's id"]
    },
    answers: [
        { type: String }
    ],
    marks: {
        type: Number
    }
})


module.exports = mongoose.model('answer', answersSchema);