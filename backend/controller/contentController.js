const contentDb = require('../models/content');
const asyncHandler = require('express-async-handler')
const { checkDate, convertToISO, verifyContent } = require('./utils');

//get activities
//GET method
// /:id
//res status 200 and activities of the subject
const getActivities = asyncHandler(async(req, res) => {
    const id = req.params.id;
    const activities = await contentDb.findOne({ subjectId: id }, { activities: 1, _id: 0 });
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
    var copyDate = new Date(date.getTime());
    var ahead = new Date(copyDate.setDate(date.getDate() + 7));
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
    var { subjectId, activityName, type, totalMarks, dueDate, startDate, data, dataFile} = req.body;
    if (!activityName || !totalMarks || !type) {
        res.status(400).json('incomplete fields');
    }
    try {
        await verifyContent(subjectId, dueDate, startDate);
    } catch (e) {
        res.status(400).json(e.message);
        throw new Error(e);
    }
    const subject = await contentDb.findOne({ subjectId });
    const activities = subject.activities;
    if (activities.find(a => a.name === activityName)) {
        res.status(400).json('Activity name has been used');
        throw new Error('Activity name has been used');
    }
    startDate = convertToISO(startDate);
    dueDate = convertToISO(dueDate);
    const added = await contentDb.updateOne({ subjectId: subjectId }, {
        $addToSet: {
            activities: {
                name: activityName,
                type: type,
                totalMarks: totalMarks,
                dueDate: dueDate,
                startDate: startDate,            
                data: data,
                dataFile: dataFile
            }
        }
    })
    if (!added) {
        res.status(400).json('activity not added');
        throw new Error('Activity not added');
    }
    res.status(200).json({
        "name": activityName,
        "type": type,
        "total marks": totalMarks,
        "created Date": Date.now,
        "due date": dueDate,
        "data File": dataFile
        
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

//update activity
//PUT method
// req body { subjectId, activityName, type, totalMarks, dueDate, startDate }
//res status 200
const updateActivity = asyncHandler(async(req, res) => {
            var { subjectId, activityName, type, totalMarks, dueDate, startDate,  } = req.body;
            const subject = await contentDb.findOne({ subjectId });
            try {
                if (dueDate,  startDate) {
                    await verifyContent(subjectId, dueDate, startDate);
                }
            } catch (e) {
                res.status(400).json(e.message);
                throw new Error(e);
            }
            if (dueDate,  startDate) {
                startDate = convertToISO(startDate);
                dueDate = convertToISO(dueDate);
            }
            const activities = subject.activities;
            if (activities.find(a => a.name === activityName)) {
                await contentDb.updateOne({
                    subjectId,
                    "activities.name": activityName
                }, {
                    $set: {
                        "activities.$.type": type,
                        "activities.$.totalMarks": totalMarks,
                        "activities.$.dueDate": dueDate,
                        "activities.$.startDate": startDate,

                    }
                })
                res.status(200).json("Activity updated");
            } else {
                res.status(400).json("Activity not found");
                throw new Error("Activity name invalid");
            }
        }) 
    
    //update data
    //put method
    //req body activityName, subjectId
    const updateData = asyncHandler(async(req, res) => {
        var { subjectId, activityName, newData } = req.body;
        const subject = await contentDb.findOne({ subjectId });
        if (!subject) {
            res.status(400).json('Invalid subject id')
            throw new Error("Invalid subject id");
        }
        var activities = subject.activities;
        var found = await activities.find(a => a.name === activityName);
        if (found === undefined) {
            res.status(400).json('Invalid activity Name')
            throw new Error("Invalid activity Name");
        }
        const updated = await contentDb.updateOne({
            subjectId,
            "activities.name": activityName
        }, {
            $set: {
                "activities.$.data": newData
            }
        })
        if (!updated) {
            res.status(400).json('Data for ' + activityName + " not updated");
            throw new Error('data not updated');
        }
        res.status(200).json('Data for ' + activityName + " updated");
    
    })
module.exports = {
    getActivities,
    addActivities,
    removeActivity,
    getByDate,
    updateActivity,
    updateData
};