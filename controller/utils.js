const asyncHandler = require('express-async-handler')
const parent = require('../models/parent');
const admin = require('../models/admin');
const student = require('../models/student');
const teacher = require('../models/teacher');
const subject = require('../models/subject');
const mongoose = require('mongoose');

const getAll = asyncHandler(async() => {
    var users = await teacher.find({});
    var parents = await parent.find({});
    var students = await student.find({});

    parents.forEach(parent => {
        users.push(parent);
    });
    students.forEach(student => {
        users.push(student);
    });
    return users;
})

const findUser = (async(field, data) => {
    var user = await admin.findOne({
        [field]: data
    });

    if (!user) {
        user = await parent.findOne({
            [field]: data
        });
    }

    if (!user) {
        user = await student.findOne({
            [field]: data
        });
    }

    if (!user) {
        user = await teacher.findOne({
            [field]: data
        });
    }
    return user;
})

const updateData = asyncHandler(async(email, role, column, newData) => {
    if (role.toLowerCase() === "admin" || role.toLowerCase() === "teacher" || role.toLowerCase() === "parent" || role.toLowerCase() === "student") {
        await mongoose.model(role).updateOne({ email: email }, {
            $set: {
                [column]: newData
            }
        });
    } else {
        throw new Error('Invalid Role');
    }
})

const insertUser = asyncHandler(async(role, body) => {
    mongoose.model(role).insertMany(body, (error, result) => {
        if (error) {
            throw new Error(error);
        } else {
            return body;
        }
    })
})

module.exports = { findUser, updateData, insertUser, getAll };