const asyncHandler = require('express-async-handler')
const studentDb = require('../models/student');
const subjectDb = require('../models/subject');
const teacher = require('../models/teacher');
const teacherDb = require('../models/teacher')
const getStudent = asyncHandler(async(studentId) => {
    return await studentDb.findOne({ id: studentId });
})

const getSubject = asyncHandler(async(subjectId) => {
    return await subjectDb.findOne({ id: subjectId });
})

//add subject to teacher list
//PUT /api/users/teacher/subject
//Body teacherId, subjectID
const  addSubjToTeacher= asyncHandler(async(req, res) => {
    const {subjectId, teacherId} = req.body
    var teacher = await teacherDb.findOne({id: teacherId})
    var subject = await subjectDb.findOne({id:subjectId})
    if(!teacher) {
        res.status(400).json('teacher not found');
        throw new Error('teacher Id not valid')
    } if(!subject) {
        res.status(400).json('subject not found');
        throw new Error('subject Id not valid')
    }
    await teacherDb.updateOne({
        id: teacherId
    }, {
        $addToSet: {Subjects: subjectId}
    })
    res.status(200).json('subject added')
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

module.exports = { enrollStudent, addSubjToTeacher };