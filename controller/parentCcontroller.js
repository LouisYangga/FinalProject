const validator = require('validator');
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt');
var validateDate = require("validate-date");
const saltRounds = 10;

const parent = require('../models/parent');
const student = require('../models/student');

const getChildren = asyncHandler(async(req, res) => {
    const { id } = req.body;
    const parent = await parent.findOne({
        id: id
    });
    const childrenId = parent.enrolledChildrenId;
    if (childrenId.length === 0) {
        res.status(400).json('No enrolled children');
    }
    var children;
    for (var i = 0; i < childrenId.length; i++) {
        children.push(await student.find({ parentId: id }))
    }
    res.status(200).json(children);
})

module.exports = { getChildren };