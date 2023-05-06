const asyncHandler = require('express-async-handler')
const studentDb = require('../models/student');
const subjectDb = require('../models/subject');
const contentDb = require('../models/content');
const asnwersDb = require('../models/answers');
const { insertSubject, getSubject, getStudent, getTeacher, checkDate } = require('../controller/utils');
const { getActivities } = require('./contentController');

//get subject
//GET method
// /:id
//res status 200 and the subject
const getOne = asyncHandler(async(req, res) => {
        const id = req.params.id;
        var subject = await getSubject(id);
        if (subject) {
            res.status(400).json({
                "subjectCode": subject.id,
                //changed from subject.name to subject.subjectName (ridhwan)
                "subjectName": subject.subjectName,
                "coordinator": subject.coordinator,
                "start date": subject.startDate,
                "end date": subject.endDate,
                "current students": subject.enrolledStudentId.length
            })
        }
    })

//get all Subjects run by coordinator
//GET method
// /:id
//res status 200 and the subjects
const getSubjByCoord = asyncHandler(async(req, res) => {
        const coordinator = req.params.id
        var subjects = await subjectDb.find({coordinator: coordinator})
        res.status(200).json(subjects)
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
    await contentDb.deleteOne({ subjectId: id });
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
        const start = checkDate(startDate);
        if (start !== null) {
            res.status(400).json(start);
            throw new Error(start);
        }
    }

    if (endDate) {
        const end = checkDate(endDate);
        if (end !== null) {
            res.status(400).json(end);
            throw new Error(end);
        }
    }

    var inserted = await insertSubject(req.body);
    if (inserted === null) {
        res.status(400);
        throw new Error('Subject not inserted');
    }

    contentDb.insertMany({
        subjectId: id,
        subjectName: subjectName
    })
    res.status(200).json(req.body);
})
//update subject
    //PUT method
    //Body (id, subject name, coordinator) startDate, endDate
    const updateSubject = asyncHandler(async(req, res) => {
        const { id, subjectName, coordinator, startDate, endDate } = req.body;
        if (!id) {
            res.status(400).json('Subject Id invalid')
            throw new Error('Subject Id invalid')
        }
        const teacher = await getTeacher(coordinator);
        if (!teacher) {
            res.status(400).json('Coordinator id invalid')
            throw new Error('Coordinator id invalid')
        }
        await subjectDb.updateOne({ id }, {
            $set: {
                subjectName,
                coordinator,
                startDate,
                endDate
            }
        })
        res.status(200).json('Subject Information updated')
    })

const verification = async(studentId, subjectId, activityName) => {
        var student = await getStudent(studentId);
        var subject = await getSubject(subjectId);
        if (!student) {
            return "Invalid Student Id";
        }
        if (!subject) {
            return "Subject Id not valid";
        }
        subject = await contentDb.findOne({ subjectId });
        var activities = subject.activities;
        var found = await activities.find(a => a.name === activityName);
        if (found === undefined) {
            return "Invalid activity Name";
        }
        return null;
    }
    //save answer
    //student's id, subject's id, activity's name, array of answers in String. 
    //POST method

const saveAnswer = asyncHandler(async(req, res) => {
    const { studentId, subjectId, activityName, activityType, answers } = req.body;
    var error = await verification(studentId, subjectId, activityName);
    if (error !== null) {
        res.status(400).json(error);
        throw new Error(error);
    }
    if (await asnwersDb.findOne({
            studentId,
            subjectId,
            activityName
        })) {
        res.status(400).json("Answers already saved");
        throw new Error("Answers already saved");
    }
    asnwersDb.insertMany(req.body);
    res.status(200).json("answers saved");
})

//update answers
//student's id, subject's id, activity's name, array of answers in String. 
//PUT method
const updateAnswers = asyncHandler(async(req, res) => {
    const { studentId, subjectId, activityName, answers, activityType } = req.body;
    var error = await verification(studentId, subjectId, activityName);
    if (error !== null) {
        res.status(400).json(error);
        throw new Error(error);
    }
    if (!await asnwersDb.findOne({
            studentId,
            subjectId,
            activityName
        })) {
        res.status(400).json("Unable to update answer");
        throw new Error("Unable to update answer");
    }
    await asnwersDb.updateOne({
        studentId,
        subjectId,
        activityName
    }, {
        answers,
        activityType
    });
    res.status(200).json("Answers updated");

})

//get answers
//student's id, subject's id, activity's name
//POST method
const getAnswers = asyncHandler(async(req, res) => {
    const { studentId, subjectId, activityName } = req.body;
    var error = await verification(studentId, subjectId, activityName);
    if (error !== null) {
        res.status(400).json(error);
        throw new Error(error);
    }
    var answers = await asnwersDb.findOne({
        studentId,
        subjectId,
        activityName
    });
    if (!answers) {
        res.status(400).json("Answers not found");
        throw new Error("Answers not found");
    }
    res.status(200).json(answers);
})

    //get all answers
    //studentId, subjectId
    //POST method
    const getAllAnswers = asyncHandler(async(req, res) => {
        const { subjectId, studentId } = req.body;
        var student = await getStudent(studentId);
        var subject = await getSubject(subjectId);
        if (!student) {
            res.status(400).json('error');
            throw new Error('error');
        }
        if (!subject) {
            res.status(400).json('error');
            throw new Error('error');
        }
       
        var answers = await asnwersDb.find({ studentId, subjectId }).select({ "activityName": 1, "answers": 1, "marks":1, "activityType":1,"_id": 0 })
    
        if (!answers) {
            res.status(400).json("Answers not found");
            throw new Error("Answers not found");
        }
        res.status(200).json(answers);
    })

    //set mark for answer
    //studentId, subjectId
    //PUT method
    const setAnswerMark = asyncHandler(async(req, res) => {
        const {subjectId, studentId, activityName, mark} = req.body;

        var subject = await getSubject(subjectId)
        var student = await getStudent(studentId)

        if (!student) {
            res.status(400).json('error');
            throw new Error('error');
        }
        if (!subject) {
            res.status(400).json('error');
            throw new Error('error');
        }
        if(isNaN(mark)) {
            res.status(400).json('error');
            throw new Error('error');
        }
        

        await asnwersDb.updateOne({
            subjectId: subjectId,
            studentId: studentId,
            activityName: activityName
        }, {
            marks: mark
        }) 
        res.status(201).json(`Mark had been added`);

    })

module.exports = {
    getStudents,
    getAllSubject,
    removeSubject,
    addSubject,
    getOne,
    saveAnswer,
    updateAnswers,
    getAnswers,
    getAllAnswers,
    updateSubject,
    getSubjByCoord,
    setAnswerMark
}