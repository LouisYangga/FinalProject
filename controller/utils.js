const asyncHandler = require('express-async-handler')
const parent = require('../models/parent');
const admin = require('../models/admin');
const student = require('../models/student');
const teacher = require('../models/teacher');
const subject = require('../models/subject');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const fs = require('fs');
const { promisify } = require('util');
const { template } = require('handlebars');
const readFile = promisify(fs.readFile);

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

const sendEmail = (async(receiver, subject, html) => {
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
                html: html
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

module.exports = { findUser, updateData, insertUser, getAll, sendEmail };