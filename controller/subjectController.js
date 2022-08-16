const asyncHandler = require('express-async-handler')
const teacherDb = require('../models/teacher');
const studentDb = require('../models/student');
const subjectDb = require('../models/subject');
const subject = require('../models/subject');



// get students
// GET/ api/users/subject/students
// BODY id (subject's id)
// res children status 200
const getStudents = asyncHandler(async(req, res) => {
    var subjectId = req.params.id
    const course = await subjectDb.findOne({
        id: subjectId
    });
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
                console.log(students.length)
            }
        } catch (error) {
            throw new Error('error ' + error);
        }
    }))
    res.status(200).json(students);

})

module.exports = { getStudents }