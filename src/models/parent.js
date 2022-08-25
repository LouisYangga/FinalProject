const mongoose = require('mongoose');

const parentSchema = mongoose.Schema({
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
    password: {
        type: String,
        require: [true, 'Please enter password']
    },
    gender: {
        type: String,
        require: [true, 'Please specify gender']
    },
    contact: {
        type: Number,
        require: [true, 'Please input contact number']
    },
    address: {
        street: { type: String },
        suburb: { type: String },
        city: { type: String },
        postCode: { type: Number },
        state: { type: String },
        country: { type: String }
    },
    enrolledChildrenId: []
}, {
    timestamps: true
})

module.exports = mongoose.model('parent', parentSchema);