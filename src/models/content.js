const mongoose = require('mongoose');


const subjectContentSchema = new mongoose.Schema({
    subjectId: {
        type: String,
        required: [true, 'Generate ID Fail']
    },

    activities: [{
        name: {
            type: String,
            required: [true, "Please specify the activity's name"],
            minlength: 5,
            maxlength: 255
        },
        type: {
            type: String,
            required: [true, "Please specify the type of activity"],
            minlength: 2,
            maxlength: 50
        },
        totalMarks: {
            type: Number,
            required: [true, "Total marks for the activity"],
            min: 0,
            max: 100
        },
        dateCreated: {
            type: Date,
            required: true,
            default: Date.now
        },
        dueDate: {
            type: Date,
            required: [true, "Please specify the due date for the activity"]
        }
    }]
})


module.exports = mongoose.model('subjectContent', subjectContentSchema);