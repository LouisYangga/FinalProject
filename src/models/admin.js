const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    role: {
        type: String,
        require: [true, 'Please insert role']
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
    id: {}
}, {
    timestamps: true
})

module.exports = mongoose.model('admin', adminSchema);