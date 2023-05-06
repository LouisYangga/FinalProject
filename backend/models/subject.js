const mongoose = require('mongoose');

const subjectSchema = mongoose.Schema({
    id: {
        type: String,
        required: [true, 'Generate ID fail']
    },
    subjectName: {
        type: String,
        required: [true, 'Please specify name']
    },
    coordinator: {
        type: String,
        required: [true, 'Who is the coordinator']
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    enrolledStudentId: [Number]
}, {
    timestamps: true
})

module.exports = mongoose.model('subject', subjectSchema);