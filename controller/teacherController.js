const asyncHandler = require('express-async-handler')
const studentDb = require('../models/student');
const subjectDb = require('../models/subject');

const getStudent = asyncHandler(async(studentId) => {
    return studentDb.findOne({ id: studentId });
})

const getSubject = asyncHandler(async(subjectId) => {
    return subjectDb.findOne({ id: subjectId });
})


const enrollStudent = asyncHandler(async(req, res) => {
    const { studentId, subjectId } = req.body;
    var student = getStudent(studentId);
    var subject = getSubject(subjectId);

    if (!subject || !student) {
        res.status(400).json('subject or student id not valid');
    }
    const capacity = 20; //class capacity
    if (subject.enrolledStudentId.length > capacity) {
        res.status(400).json('Class for this subject is full');
    }
    const max = 3; //max subject
    if (student.enrolledSubjectId > max) {
        res.status(400).json('You already has 3 subjects');
    }

    studentDb.updateOne({
        id: studentId
    }, {
        $push: { enrolledSubjectId: subjectId }
    })

    subjectDb.updateOne({
        id: subjectId
    }, {
        $push: { enrolledStudentId: studentId }
    })

    res.status(201).json(`Student with id: ${studentId}, enrolled into subject (${subjectId})`);
})