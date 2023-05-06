const validator = require('validator');
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
const { findUser, updateData, getAllUser, updatePass, sendEmail, register, 
    getAllStudents, generateToken, getAllTeachers, uploadImage } = require('./utils')
const mongoose = require('mongoose');
const imageDb = require('../models/image');
const studentDb = require('../models/student')

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
    if (!user) {
        return res.status(400).send('Incorrect email or password.');
    }
    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword) res.status(202).json({
        "role": user.role,
        "id": user.id,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "email": user.email,
        "gender": user.gender,
        "DOB": user.DOB,
        "enrolled childrenId": user.enrolledChildrenId,
        "subjectIds": user.enrolledSubjectId,
        "address": user.address,
        "subjects":user.subjects,
        "token": generateToken(user)
    });
    if (!validPassword) return res.status(400).send('Incorrect email or password.');
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
                //Added from louis' branch
                "enrolledChildrenId": user.enrolledChildrenId,
                "enrolledSubjectId": user.enrolledSubjectId,
                "address": user.address,
                "hasPaid": user.hasPaid
                //Finish of update
            });
        }
        res.status(400)
        throw new Error('User not found');
    })

    //Added getTeachers (ridhwan)
//get teachers
//GET /api/users/teachers
const getTeachers = asyncHandler(async(req, res) => {
    var teachers = await getAllTeachers();
    res.status(200).json(teachers);
})
    //list users 
    //GET /api/users/users
    //BODY
    //res USERS
const getUsers = asyncHandler(async(req, res) => {
    var users = await getAllUser();
    res.status(200).json(users)
})

//get students
//GET /api/users/students
const getStudents = asyncHandler(async(req, res) => {
        var students = await getAllStudents();
        console.log(students)
        res.status(200).json(students);
    })



    //Get color strings
    //post /api/users/colors
const colorStrings = asyncHandler(async(req, res) => {
    const { email } = req.body;
    var admin = await findUser("email", email);

    if (!admin) {
        res.status(400).json("Invalid email");
        throw new Error("Invalid email");
    }
    if (admin.role !== "admin") {
        res.status(400).json("user is not admin");
        throw new Error("Unauthorized user");
    }
    res.status(200).json({
        "primary": admin.primary,
        "secondary": admin.secondary,
        "background": admin.background
    })
})

// register new user
// POST/ api/users
// BODY role, firstName, lastName, email, password -> {required}, DOB, gender
// res USER status 201
const registerUser = asyncHandler(async(req, res) => {
    const { role, firstName, lastName, email, password, DOB, gender, parentId } = req.body;
    try {
        const body = await register(req.body);
        res.status(200).json({
            "role": body.role,
            "User Id": body.id,
            "full name": body.firstName + " " + body.lastName,
            "email": body.email,
            "parentId": body.parentId,
            "token": generateToken(req.body)
        });
    } catch (error) {
        res.status(400).json(error.toString());
        throw new Error(error);
    }
})

//change password
//PUT /api/users/change-pass
//BODY email, oldPass, newPass
//res status 202
const changePass = asyncHandler(async(req, res) => {
    const { email, oldPass, newPass } = req.body;
    if (await updatePass(email, oldPass, newPass) === true) {
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
    var { newPass } = req.body;
    //var id = (req.params.id - 1000) / 1000;
    var id = req.params.id
    var user = await studentDb.findOne({id});
    if (!user) {
        throw new Error('Email Invalid');
    }
    const salt = await bcrypt.genSalt(10);
    newPass = await bcrypt.hash(newPass, salt);
    await updateData(user.email, user.role, 'password', newPass);
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
    const {
        role,
        firstName,
        lastName,
        email,
        DOB,
        gender,
        street,
        suburb,
        city,
        postCode,
        state,
        country,
        newEmail,
        primary,
        secondary,
        background
    } = req.body;

    if (!firstName || !email || !role) {
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
    } else {
        await updateData(email, role, "primary", primary);
        await updateData(email, role, "secondary", secondary);
        await updateData(email, role, "background", background);
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
    //change paid status
    //PUT /api/users/paid
    //BODY studentId, status
    //res status 200
const updateStatus = asyncHandler(async(req, res) => {
    const { studentId, status } = req.body;
    var user = await mongoose.model('student').findOne({ id: studentId });
    if (!user) {
        res.status(400).json('student not exists');
        throw new Error('student not found');
    }
    await mongoose.model('student').updateOne({ id: studentId }, { $set: { hasPaid: status } });
    res.status(200).json("student payment status has been updated");
})

const uploadLogo = asyncHandler(async(req, res) => {
    const { desc, name } = req.body;
    if (req.file == undefined) {
        return res.status(400).send("Please upload a file!");
    }
    const uploaded = await uploadImage(desc, name, req.file.filename);
    if (uploaded === false) {
        res.status(400).json('File Not uploaded');
    }
    res.status(200).json('File successfully save');
})
//get logo
const getLogo = asyncHandler(async(req, res) => {
    const name = req.params.name;
    const image = await imageDb.findOne({ name });
    if (!image) {
        return res.status(400).json('Image not found')
    }
    const base64data = Buffer.from(image.img.data, 'binary').toString('base64');
    return res.status(200).json({
        "data": base64data,
        "contentType": image.img.contentType
    })
})

module.exports = {
    loginUser,
    registerUser,
    changePass,
    updateDetails,
    getUser,
    getUsers,
    removeUser,
    resetPass,
    email,
    getStudents,
    colorStrings,
    updateStatus,
    getTeachers,
    uploadLogo,
    getLogo
};
