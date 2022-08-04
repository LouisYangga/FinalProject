const asyncHandler = require('express-async-handler')
const studentDb = require('../models/student');
const subjectDb = require('../models/subject');

const getStudent = asyncHandler(async(studentId) => {
    return await studentDb.findOne({ id: studentId });
})

const getSubject = asyncHandler(async(subjectId) => {
    return await subjectDb.findOne({ id: subjectId });
})

// enroll student
// PUT/ api/users/teacher/enroll
// BODY studentId, subjectId
// res status 200 `Student with id: ${studentId}, enrolled into subject (${subjectId})`
const enrollStudent = asyncHandler(async(req, res) => {
    const { studentId, subjectId } = req.body;
    var student = await getStudent(studentId);
    var subject = await getSubject(subjectId);

    if (!subject || !student) {
        res.status(400).json('subject or student id not valid');
        throw new Error('subject or student id not valid')
    }
    var subjectLength = student.enrolledSubjectId.length;
    const capacity = 20; //class capacity
    if (subject.enrolledStudentId.length + 1 > capacity) {
        res.status(400).json('Class for this subject is full');
        throw new Error('Class for this subject is full')

    }
    const max = 3; //max subject
    if (subjectLength + 1 > max) {
        res.status(400).json('You already has 3 subjects');
        throw new Error('You already has 3 subjects')
    }
    await studentDb.updateOne({
        id: studentId
    }, {
        $addToSet: { enrolledSubjectId: subjectId }
    })
    student = await getStudent(studentId);
    var changed = student.enrolledSubjectId.length;
    if (changed === subjectLength) {
        res.status(400).json(`You enrolled to subject ${subjectId}`);
        throw new Error(`You enrolled to subject ${subjectId}`);
    }

    await subjectDb.updateOne({
        id: subjectId
    }, {
        $addToSet: { enrolledStudentId: studentId }
    })

    res.status(201).json(`Student with id: ${studentId}, enrolled into subject (${subjectId})`);
})


module.exports = { enrollStudent };