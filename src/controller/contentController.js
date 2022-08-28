const contentDb = require('../models/content');
const asyncHandler = require('express-async-handler')
const content = require('../models/content');
const { checkDate } = require('./utils');

const convertToISO = ((date) => {
        const [day, month, year] = date.toString().split('/');
        date = new Date(+year, +month - 1, +day + 1);
        return date.toISOString();
    })
    //get activities
    //GET method
    // /:id
    //res status 200 and activities of the subject
const getActivities = asyncHandler(async(req, res) => {
    const id = req.params.id;
    const activities = await contentDb.findOne({ id }, { activities: 1, _id: 0 });
    res.status(200).json(activities);
})

//get by date
//POST method
// date, subject id
//res status 200 and activities 7 days ahead
const getByDate = asyncHandler(async(req, res) => {
    var { date, subjectId } = req.body;
    const check = checkDate(date);
    const subject = await contentDb.findOne({ subjectId });

    if (check !== null) {
        res.status(400).json(check);
        throw new Error(check);
    }
    const [day, month, year] = date.split('/');
    date = new Date(+year, +month - 1, +day + 1);
    var ahead = new Date();
    ahead.setDate(date.getDate() + 7);

    if (subject === null) {
        res.status(400).json('subject not found');
        throw new Error('subject not found');
    }

    const activities = subject.activities;
    var results = new Array();
    await activities.forEach(activity => {
        const aDate = activity.startDate;
        if (aDate < ahead && aDate >= date) {
            results.push(activity);
        }
    });
    res.status(200).json(results)

})


//add activities
//PUT method
//{subjectId, name, type, totalMarks, dueDate}
//res status 200 and the activities
const addActivities = asyncHandler(async(req, res) => {
    var { subjectId, name, type, totalMarks, dueDate, startDate } = req.body;
    const subject = await contentDb.findOne({ subjectId });

    if (!subject) {
        res.status(400).json('Subject not found');
        throw new Error('Subject Not Found');
    }

    const activities = subject.activities;
    if (activities.find(a => a.name === name)) {
        res.status(400).json('Activity name has been used');
        throw new Error('Activity name has been used');
    }
    const due = checkDate(dueDate)
    if (due !== null) {
        res.status(400).json(due);
        throw new Error(due);
    }
    const start = checkDate(startDate)
    if (start !== null) {
        res.status(400).json(start)
        throw new Error(start);
    }
    startDate = convertToISO(startDate);
    dueDate = convertToISO(dueDate);
    const added = await contentDb.updateOne({ subjectId: subjectId }, {
        $addToSet: {
            activities: {
                name: name,
                type: type,
                totalMarks: totalMarks,
                dueDate: dueDate,
                startDate: startDate
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
    if (!subjectId || !activityName) {
        res.status(400).json('Information not enough');
        throw new Error('Information not enough');
    }
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


module.exports = { getActivities, addActivities, removeActivity, getByDate };