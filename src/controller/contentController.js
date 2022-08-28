const contentDb = require('../models/content');
const asyncHandler = require('express-async-handler')
var validateDate = require("validate-date");

//get activities
//GET method
// /:id
//res status 200 and activities of the subject
const getActivities = asyncHandler(async(req, res) => {
    const id = req.params.id;
    const activities = await contentDb.findOne({ id }, { activities: 1, _id: 0 });
    res.status(200).json(activities);
})

//add activities
//PUT method
//{subjectId, name, type, totalMarks, dueDate}
//res status 200 and the activities
const addActivities = asyncHandler(async(req, res) => {
    const { subjectId, name, type, totalMarks, dueDate } = req.body;
    const subject = await contentDb.findOne({ subjectId });

    if (!subject) {
        res.status(400).json('Subject not found');
        throw new Error('Subject Not Found');
    }
    if (subject.name === name) {
        res.status(400).json('Subject name has been used');
        throw new Error('Subject name has been used')
    }
    if (!validateDate(dueDate, responseType = "boolean", dateFormat = "dd/mm/yyyy")) {
        res.status(400)
        throw new Error('Please input proper date format dd/mm/yyy')
    }
    const added = await contentDb.updateOne({ subjectId: subjectId }, {
        $push: {
            activities: {
                name: name,
                type: type,
                totalMarks: totalMarks,
                dueDate: dueDate
            }
        }
    })
    if (!added) {
        res.status(400).json('activity not added');
        throw new Error('Activity not added');
    }
    res.status(200).json({
        "name": name,
        "type": type,
        "total marks": totalMarks,
        "created Date": Date.now,
        "due date": dueDate
    })
})

//delete activity 
//PUT method
//{subjectId}
//res status 200
const removeActivity = asyncHandler(async(req, res) => {
    const { subjectId, activityName } = req.body;

    const deleted = await contentDb.updateOne({ subjectId }, {
        $pull: {
            activities: {
                name: activityName
            }
        }
    })
    if (deleted) {
        res.status(200).json('Activity deleted');
    } else {
        res.status(400).json('Activity not deleted');
        throw new Error('Something Went Wrong');
    }
})
module.exports = { getActivities, addActivities, removeActivity };