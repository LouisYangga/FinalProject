const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    role: {
        type: String,
        require: [true, 'Please insert role']
    },
    id: {
        type: String,
        require: [true, 'Generate ID fail']
    },
    parentId: {
        type: Number,
        require: [true, 'Generate ID fail']
    },
    firstName: {
        type: String,
        require: [true, 'Please add first name']
    },
    lastName: {
        type: String,
        require: [true, 'Please add last name']
    },
    email: {
        type: String,
        require: [true, 'Please add email']
    },
    password: {
        type: String,
        require: [true, 'Please enter password']
    },
    DOB: {
        type: String,
    },
    address: {
        street: { type: String },
        suburb: { type: String },
        city: { type: String },
        postCode: { type: Number },
        state: { type: String },
        country: { type: String }
    },
    enrolledSubjectId: [Number],
    gender: {
        type: String,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('student', studentSchema);