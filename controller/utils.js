const asyncHandler = require('express-async-handler')
const parent = require('../models/parent');
const admin = require('../models/admin');
const student = require('../models/student');
const teacher = require('../models/teacher');
const subject = require('../models/subject');

const getAll = asyncHandler(async() => {
    var users = await teacher.find({});
    users.push(await parent.find({}));
    users.push(await student.find({}));
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
    if (role.toLowerCase() === "admin") {
        await admin.updateOne({ email: email }, {
            $set: {
                [column]: newData
            }
        });
    } else if (role.toLowerCase() === "parent") {
        await parent.updateOne({ email: email }, {
            $set: {
                [column]: newData
            }
        });
    } else if (role.toLowerCase() === "student") {
        await student.updateOne({ email: email }, {
            $set: {
                [column]: newData
            }
        });
    } else if (role.toLowerCase() === "teacher") {
        await teacher.updateOne({ email: email }, {
            $set: {
                [column]: newData
            }
        });
    } else {
        throw new Error('Invalid Role');
    }
})

const insertUser = asyncHandler(async(role, body) => {
    if (role === "student") {
        student.insertMany(body, (error, result) => {
            if (error) {
                console.log(error)
                return false;
            } else {
                return body;
            }
        })
    } else if (role === "teacher") {
        teacher.insertMany(body, (error, result) => {
            if (error) {
                console.log(error)
                return false;
            } else {
                return body;
            }
        })
    } else {
        parent.insertMany(body, (error, result) => {
            if (error) {
                console.log(error)
                return true;
            } else {
                return body;
            }
        })
    }

})

module.exports = { findUser, updateData, insertUser, getAll };