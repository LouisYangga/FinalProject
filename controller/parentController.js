const asyncHandler = require('express-async-handler')
const parent = require('../models/parent');
const student = require('../models/student');

const getChildren = asyncHandler(async(req, res) => {
    const { id } = req.body;
    const person = await parent.findOne({
        id: id
    });
    const childrenId = person.enrolledChildrenId;
    if (childrenId.length === 0) {
        res.status(400).json('No enrolled children');
    }
    var children = [];
    for (var i = 0; i < childrenId.length - 1; i++) {
        children.push(await student.find({ parentId: id }))
    }
    res.status(200).json(children);
})

module.exports = { getChildren };