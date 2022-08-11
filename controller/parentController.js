const asyncHandler = require('express-async-handler')
const parent = require('../models/parent');
const student = require('../models/student');

// get children
// GET/ api/users/parent/children
// BODY id (parent's id)
// res children status 200

const getChildren = asyncHandler(async(req, res) => {
    var id = req.params.id
    const person = await parent.findOne({
        id: id
    });
    const childrenId = person.enrolledChildrenId;
    if (childrenId.length === 0) {
        res.status(400).json('No enrolled children');
        throw new Error(`No enrolled children`)
    }
    var children = await student.find({ parentId: id })
    res.status(200).json(children);
})

module.exports = { getChildren };