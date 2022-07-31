const validator = require('validator');
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
var validateDate = require("validate-date");
const saltRounds = 10;

const parent = require('../models/parent');
const admin = require('../models/admin');
``
const student = require('../models/student');
const teacher = require('../models/teacher');

//login user 
//POST /api/users/login
//BODY email and password
//res USER

const loginUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    const user = await findUser('email', email);
    // (await bcrypt.compare(password, user.password)
    if (user && user.password === password) {
        res.status(202).json(user);
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

// register new user
// POST/ api/users
// BODY role, firstName, lastName, email, password -> {required}, DOB, gender
// res USER status 201

const registerUser = asyncHandler(async(req, res) => {
    const { role, firstName, lastName, email, password, DOB, gender, id, parentId } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    if (!validateDate(DOB, responseType = "boolean", dateFormat = "dd/mm/yyyy")) {
        res.status(400)
        throw new Error('Please input proper date format dd/mm/yyy')
    }
    var roles = role.toLowerCase();
    if (roles !== "student" && roles !== "parent" && roles !== "teacher") {
        res.status(400)
        console.log(roles);
        throw Error("Invalid Role");
    }
    var userID = (Math.floor(Math.random() * 100)) + 999;
    const duplicateEmail = await findUser('email', email);
    var duplicateID = true;
    if (duplicateEmail) {
        console.log(email);
        res.status(400)
        throw new Error('Email has been used')
    }
    while (duplicateID) {
        userID = (Math.floor(Math.random() * 100)) + 999;
        req.body.id = userID;
        duplicateID = await findUser('id', userID);
    }

    if (await insertUser(roles, req.body) !== null) {
        res.status(200).json({
            "user id": userID,
            "email": email,
            "role": roles
        });
    }
    console.log('User has been registered, thank you :)');
})

//change password
//PUT /api/users/change-pass
//BODY email, oldPass, newPass
//res status 202
const changePass = asyncHandler(async(req, res) => {
    const { email, oldPass, newPass } = req.body;
    var user = await findUser('email', email);
    if (user && user.password === oldPass) {
        await updateData(email, user.role, "password", newPass);
        user = await findUser('email', email);
        if (user.password !== oldPass) {
            res.status(200).json("Update successful");
        } else {
            res.status(400).json("password not updated");
        }
    } else {
        res.status(400)
        throw Error("Invalid Credentials");
    }
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


module.exports = { loginUser, registerUser, changePass };