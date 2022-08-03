const validator = require('validator');
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
var validateDate = require("validate-date");
const saltRounds = 10;
const { findUser, updateData, insertUser, getAll } = require('./utils')
const parent = require('../models/parent');

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

//find one user 
//GET /api/users/find
//BODY field, data
//res USER
const getUser = asyncHandler(async(req, res) => {
        const { field, data } = req.body;
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
    var users = await getAll();
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
        if (roles === 'student' && parentId !== null) {
            await parent.updateOne({
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
    var user = await findUser('email', email);
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
    await updateData(email, role, "email", newEmail);
    res.status(202).json("Update successful");

})


module.exports = { loginUser, registerUser, changePass, updateDetails, getUser, getUsers };