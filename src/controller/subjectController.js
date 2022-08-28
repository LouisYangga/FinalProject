const asyncHandler = require('express-async-handler')
var validateDate = require("validate-date");
const studentDb = require('../models/student');
const subjectDb = require('../models/subject');
const contentDb = require('../models/content');
const { insertSubject, getSubject } = require('../controller/utils');

//get subject
//GET method
// /:id
//res status 200 and the subject
const getOne = asyncHandler(async(req, res) => {
        const id = req.params.id;
        var subject = await getSubject(id);
        if (subject) {
            res.status(400).json({
                "subject code": subject.id,
                "subject name": subject.name,
                "coordinator": subject.coordinator,
                "start date": subject.startDate,
                "end date": subject.endDate,
                "current students": subject.enrolledStudentId.length
            })
        }
    })
    //get all subjects
    //GET method
    //res status 200 and all subjects
const getAllSubject = asyncHandler(async(req, res) => {
        var subjects = await subjectDb.find({});
        res.status(200).json(subjects);
    })
    // get students per subjct
    // GET/ api/users/subjects/:id
    // PARAMS id (subject's id)
    // res children status 200 end of array will be total students
const getStudents = asyncHandler(async(req, res) => {
    var subjectId = req.params.id
    const course = await subjectDb.findOne({
        id: subjectId
    });
    if (course === null) {
        throw new Error('Subject not found');
    }
    const studentId = course.enrolledStudentId;
    if (studentId.length === 0) {
        res.status(400).json('No enrolled Student');
        throw new Error(`No enrolled student`)
    }
    var students = [];
    await Promise.all(studentId.map(async(ids) => {
        try {
            var student = await studentDb.findOne({
                id: ids
            });
            if (student !== null) {
                students.push(student);
            }
        } catch (error) {
            throw new Error('error ' + error);
        }
    }))
    res.status(200).json(students);

})

//delete one subject
//DELETE method
//Body subject's id
//res status 200 and message
const removeSubject = asyncHandler(async(req, res) => {
    const { id } = req.body;
    const course = await subjectDb.findOne({
        id: id
    });
    if (!course) {
        throw new Error('Subject not found');
    }
    const studentId = course.enrolledStudentId;

    if (studentId.length !== 0) {
        await Promise.all(studentId.map(async(ids) => {
            try {
                await studentDb.updateOne({ id: ids }, {
                    $pull: {
                        enrolledSubjectId: id
                    }
                });
            } catch (error) {
                throw new Error('error ' + error);
            }
        }))
    }
    await subjectDb.deleteOne({ id: id });
    res.status(200).json('Subject deleted');
})

//insert one subject
//POST method
//Body (id, subject name, coordinator)-> required field, startDate, endDate
//res status 200 and subject
const addSubject = asyncHandler(async(req, res) => {
    const { id, subjectName, coordinator, startDate, endDate } = req.body;

    if (!id || !subjectName || !coordinator) {
        res.status(400).json('Please input id, subject name and coordinator');
        throw new Error('Please input id, subject name and coordinator');
    }
    var exists = await subjectDb.findOne({ id: id });
    var name = await subjectDb.findOne({ subjectName: subjectName });
    if (exists || name) {
        res.status(400);
        throw new Error('Subject code or name already used')
    }

    if (startDate) {
        if (!validateDate(startDate, responseType = "boolean", dateFormat = "dd/mm/yyyy")) {
            res.status(400)
            throw new Error('Please input proper date format dd/mm/yyy')
        }
    }

    if (endDate) {
        if (!validateDate(endDate, responseType = "boolean", dateFormat = "dd/mm/yyyy")) {
            res.status(400)
            throw new Error('Please input proper date format dd/mm/yyy')
        }
    }

    var inserted = await insertSubject(req.body);
    if (inserted === null) {
        res.status(400);
        throw new Error('Subject not inserted');
    }

    res.status(200).json(req.body);
})
module.exports = { getStudents, getAllSubject, removeSubject, addSubject, getOne }