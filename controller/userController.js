const validator = require('validator');
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
var validateDate = require("validate-date");
const saltRounds = 10;
//hashing
const { findUser, updateData, insertUser, getAllUser, updatePass, sendEmail } = require('./utils')
const mongoose = require('mongoose');

//login user 
//POST /api/users/login
//BODY email and password
//res USER
const loginUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body;
    var user = await findUser('email', email);
    if (!validator.isEmail(email)) {
        user = await findUser('id', email);
    }
    if (user && user.password === password) {
        res.status(202).json(user);
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
    var test = "qwe"
    const test1 = bcrypt.hashSync(test, saltRounds);
    console.log(bcrypt.compareSync(test, test1))
})

//find one user 
//GET /api/users/find/:field/:data
//BODY field, data
//res USER
const getUser = asyncHandler(async(req, res) => {
        var field = req.params.field;
        var data = req.params.data;
        var user = await findUser(field, data);
        if (field === "id" && !data) {
            res.status(400).json("id field cannot be empty");
        }
        if (user) {
            res.status(201).json({
                "role": user.role,
                "id": user.id,
                "firstName": user.firstName,
                "lastName": user.lastName,
                "email": user.email,
                "gender": user.gender,
                "DOB": user.DOB,
                "enrolled childrenId": user.enrolledChildrenId,
                "subject Ids": user.enrolledSubjectId,
                "address": user.address
            });
        }
        res.status(400)
        throw new Error('User not found');
    })
    //list users 
    //GET /api/users/users
    //BODY
    //res USERS
const getUsers = asyncHandler(async(req, res) => {
    var users = await getAllUser();
    res.status(200).json(users)
})

// register new user
// POST/ api/users
// BODY role, firstName, lastName, email, password -> {required}, DOB, gender
// res USER status 201

const registerUser = asyncHandler(async(req, res) => {
    const { role, firstName, lastName, email, password, DOB, gender, parentId } = req.body;

    if (!firstName || !email || !password || !role) {
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
        res.status(400)
        throw new Error('Email has been used')
    }
    while (duplicateID) {
        userID = (Math.floor(Math.random() * 100)) + 999;
        req.body.id = userID;
        duplicateID = await findUser('id', userID)
    }

    if (await insertUser(roles, req.body) !== null) {
        if (roles === 'student' && parentId !== null) {
            await mongoose.model("parent").updateOne({
                id: parentId
            }, {
                $push: { enrolledChildrenId: userID }
            })
        }
        res.status(200).json({
            "user id": userID,
            "email": email,
            "role": roles,
            "parentID": parentId
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
    if (updatePass(email, oldPass, newPass) === true) {
        res.status(200).json('Password Updated');
    } else {
        res.status(400).json('Invalid');
        throw new Error('Invalid Credentials')
    }
})

//reset password
//PUT /api/users/reset/:id
//BODY email, newPass
//res status 202
const resetPass = asyncHandler(async(req, res) => {
    const { newPass } = req.body;
    var id = (req.params.id - 1000) / 1000;
    var user = await findUser('id', id);
    if (!user) {
        throw new Error('Email Invalid');
    }
    var pass = user.password;
    updatePass(user.email, pass, newPass);
    res.status(200).json('password reset');
})

//send email 
//POST /api/users/email
//BODY email, subject, html
//res status 200
const email = asyncHandler(async(req, res) => {
        const { email, subject, html } = req.body;

        var user = await findUser('email', email);
        if (!user) {
            throw new Error('Email Invalid');
        }
        const id = user.id;
        const changedId = id * 1000 + 1000;
        var link = 'localhost:5000/api/users/reset/'.concat(changedId);
        sendEmail(email, subject, html, link);
        res.status(200).json({
            "link": link
        });
    })
    //update details
    //PUT /api/users/update-details
    //BODY firstName, email, DOB, and role are required. 
    //res status 202
const updateDetails = asyncHandler(async(req, res) => {
    const { role, firstName, lastName, email, DOB, gender, street, suburb, city, postCode, state, country, newEmail } = req.body;

    if (!firstName || !email || !DOB || !role) {
        res.status(400)
        throw new Error('Please add first name, email, role and DOB')
    }
    var user = await mongoose.model(role.toLowerCase()).findOne({ email: email });
    if (!user) {
        res.status(400)
        throw new Error('User not found')
    }
    await updateData(email, role, "firstName", firstName);
    await updateData(email, role, "lastName", lastName);
    await updateData(email, role, "DOB", DOB);
    await updateData(email, role, "gender", gender);

    if (role.toLowerCase() !== "admin") {
        await updateData(email, role, "address.street", street);
        await updateData(email, role, "address.suburb", suburb);
        await updateData(email, role, "address.city", city);
        await updateData(email, role, "address.postCode", postCode);
        await updateData(email, role, "address.state", state);
        await updateData(email, role, "address.country", country);
    }
    const duplicateEmail = await findUser('email', newEmail);
    if (duplicateEmail) {
        res.status(400)
        throw new Error('Email has been used by other user');
    }
    await updateData(email, role, "email", newEmail);
    res.status(202).json("Update successful");

})

//Remove user
//DELETE /api/users/remove
//BODY userId
//res status 200
const removeUser = asyncHandler(async(req, res) => {
    const { userId } = req.body;
    var user = await findUser("id", userId);
    if (!user) {
        res.status(400).json('user not found');
        throw new Error('User not found');
    }
    var parent = await mongoose.model('parent').findOne({ id: user.parentId });
    if (parent) {
        await mongoose.model('parent').updateOne({ id: user.parentId }, {
            $pull: {
                enrolledChildrenId: parseInt(userId)
            }
        });
    }

    await mongoose.model(user.role).deleteOne({ id: userId });
    res.status(200).json(`User ${userId} removed`);
})

module.exports = { loginUser, registerUser, changePass, updateDetails, getUser, getUsers, removeUser, resetPass, email };