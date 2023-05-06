const asyncHandler = require('express-async-handler')
const parent = require('../models/parent');
const admin = require('../models/admin');
const student = require('../models/student');
const teacher = require('../models/teacher');
const subject = require('../models/subject');
const contentDb = require('../models/content');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const fs = require('fs');
const jwt = require('jsonwebtoken');
var validateDate = require("validate-date");
const bcrypt = require('bcrypt');
const imageSchema = require('../models/image');


const getSubject = asyncHandler(async(subjectId) => {
    return await subject.findOne({ id: subjectId });
})
const getStudent = asyncHandler(async(studentId) => {
    return await student.findOne({ id: studentId });
})
const getTeacher = (async(teacherId) => {
    return await teacher.findOne({ id: teacherId });
})
const getAllStudents = asyncHandler(async() => {
    var students = await student.find({}).select({ "_id": 0, "password": 0 });
    return students;
})
//Added getAllTeachers (ridhwan)
const getAllTeachers = asyncHandler(async() => {
    var teachers = await teacher.find({}).select({ "_id": 0, "password": 0 });
    return teachers;
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
    if (user) {
        const validPassword = await bcrypt.compare(oldPass, user.password);
        console.log(validPassword);
        if (validPassword) {
            const salt = await bcrypt.genSalt(10);
            newPass = await bcrypt.hash(newPass, salt);
            await updateData(email, user.role, "password", newPass);
            user = await findUser('email', email);
            if (user.password !== await bcrypt.hash(oldPass, salt)) {
                return true;
            } else {
                return false;
            }
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
    if (!["student", "parent", "teacher", "admin"].includes(roles)) {
        throw new Error('Invalid Role');
    }
    const duplicateEmail = await findUser('email', body.email);
    var duplicateID = true;
    if (duplicateEmail) {
        throw new Error('Email has been used')
    }
    if (roles !== "admin") {
        var userID = (Math.floor(Math.random() * 100)) + 999;
        while (duplicateID) {
            userID = (Math.floor(Math.random() * 100)) + 999;
            body.id = userID;
            duplicateID = await findUser('id', userID)
        }
    } else {
        body.id = 0;
    }
    const salt = await bcrypt.genSalt(10);
    body.password = await bcrypt.hash(body.password, salt);
    if (await insertUser(roles, body) !== null) {
        if (roles === 'student' && body.parentId !== undefined) {
            await mongoose.model("student").updateOne({
                id: body.id
            }, {
                hasPaid: false
            })
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

const checkDate = ((date) => {
    if (!validateDate(date, responseType = "boolean", dateFormat = "dd/mm/yyyy")) {
        return 'Please input proper date format dd/mm/yyy';
    } else {
        return null;
    }
})
const convertToISO = ((date) => {
    const [day, month, year] = date.toString().split('/');
    date = new Date(+year, +month - 1, +day + 1);
    return date.toISOString();
})

const verifyContent = asyncHandler(async(subjectId, dueDate, startDate) => {
    const exists = await contentDb.findOne({ subjectId });
    if (!exists) {
        throw new Error('Subject Not Found');
    }
    const due = checkDate(dueDate)
    if (due !== null) {
        throw new Error(due + " in due date");
    }
    const start = checkDate(startDate)
    if (start !== null) {
        throw new Error(start + " in start date");
    }
})

const generateToken = ((data) => {
    let jwtSecretKey = "" + process.env.JWT_SECRET_KEY;
    const token = jwt.sign(JSON.parse(JSON.stringify(data)), jwtSecretKey, { expiresIn: '1h' });
    return token;
})

const uploadImage = (async(name, desc, fileName) => {
    let path = __basedir + "/resources/static/assets/uploads/" + fileName;
    var img = fs.readFileSync(path);
    var encode_img = img.toString('base64');
    var obj = {
        name: name,
        desc: desc,
        img: {
            data: new Buffer.from(encode_img, 'base64'),
            contentType: 'image/png'
        }
    }
    imageSchema.create(obj, (err, item) => {
        if (err) {
            console.log(err);
            return false;
        } else {
            // item.save();
            fs.unlinkSync(path);
            return true;
        }
    });
})

module.exports = {
    findUser,
    updateData,
    insertUser,
    getAllUser,
    updatePass,
    sendEmail,
    insertSubject,
    getSubject,
    register,
    checkDate,
    getAllStudents,
    convertToISO,
    getStudent,
    verifyContent,
    generateToken,
    getTeacher,
    getAllTeachers,
    uploadImage
};
