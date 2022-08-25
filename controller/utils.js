const asyncHandler = require('express-async-handler')
const parent = require('../models/parent');
const admin = require('../models/admin');
const student = require('../models/student');
const teacher = require('../models/teacher');
const subject = require('../models/subject');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const fs = require('fs');
var validateDate = require("validate-date");



const getSubject = asyncHandler(async(subjectId) => {
    return await subject.findOne({ id: subjectId });
})

const getAllUser = asyncHandler(async() => {
    var users = await teacher.find({}).select({ "_id": 0, "password": 0 });
    var parents = await parent.find({}).select({ "_id": 0, "password": 0 });
    var students = await student.find({}).select({ "_id": 0, "password": 0 });

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

const updatePass = asyncHandler(async(email, oldPass, newPass) => {
    var user = await findUser('email', email);
    if (user && user.password === oldPass) {
        await updateData(email, user.role, "password", newPass);
        user = await findUser('email', email);
        if (user.password !== oldPass) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
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

const register = asyncHandler(async(body) => {
    if (!body.firstName || !body.email || !body.password || !body.role) {
        throw new Error('Please add all fields')
    }
    if (!validateDate(body.DOB, responseType = "boolean", dateFormat = "dd/mm/yyyy")) {
        throw new Error('Please input proper date format dd/mm/yyy')
    }
    var roles = body.role.toLowerCase();
    if (roles !== "student" && roles !== "parent" && roles !== "teacher") {
        throw Error("Invalid Role");
    }
    var userID = (Math.floor(Math.random() * 100)) + 999;
    const duplicateEmail = await findUser('email', body.email);
    var duplicateID = true;
    if (duplicateEmail) {
        throw new Error('Email has been used')
    }
    while (duplicateID) {
        userID = (Math.floor(Math.random() * 100)) + 999;
        body.id = userID;
        duplicateID = await findUser('id', userID)
    }

    if (await insertUser(roles, body) !== null) {
        if (roles === 'student' && body.parentId !== undefined) {
            await mongoose.model("parent").updateOne({
                id: body.parentId
            }, {
                $push: { enrolledChildrenId: userID }
            })
        }
        return body;
    }
})
const sendEmail = (async(receiver, subject, html, link) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'way.space00@gmail.com',
            pass: 'befc buac bjcm ehuu'
        }
    });


    fs.readFile(html, { encoding: 'utf-8' }, function(err, html) {
        if (err) {
            console.log(err);
        } else {
            var mailOptions = {
                from: 'way.space00@gmail.com',
                to: receiver,
                subject: subject,
                html: html,
                text: link
            };
            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
    })
})

const insertSubject = asyncHandler(async(body) => {
    subject.insertMany(body, (error, result) => {
        if (error) {
            throw new Error(error);
        } else {
            return body;
        }
    })
})

module.exports = { findUser, updateData, insertUser, getAllUser, updatePass, sendEmail, insertSubject, getSubject, register };