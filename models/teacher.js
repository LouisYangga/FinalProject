const mongoose = require('mongoose');

const teacherSchema = mongoose.Schema({
    role: {
        type: String,
        require: [true, 'Please insert role']
    },
    id: {
        type: String,
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
    DOB: {
        type: String,
        require: [false]
    },
    gender: {
        type: String,
        require: [true, 'Please specify gender']
    },
    password: {
        type: String,
        require: [true, 'Please enter password']
    },
    address: {
        street: { type: String },
        suburb: { type: String },
        city: { type: String },
        postCode: { type: Number },
        state: { type: String },
        country: { type: String }
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('teacher', teacherSchema);