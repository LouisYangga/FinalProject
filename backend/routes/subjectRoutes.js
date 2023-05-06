const express = require('express');
const router = express.Router();
const { getStudents, getAllSubject, removeSubject, addSubject, getOne, saveAnswer, updateAnswers, getAnswers, getAllAnswers, updateSubject,getSubjByCoord, setAnswerMark } = require('../controller/subjectController');
const { getActivities, addActivities, removeActivity, getByDate, updateActivity, updateData } = require('../controller/contentController');
const { protect } = require('../middlewares/authToken');
router.get('/:id', protect, getStudents);
router.get('/', protect, getAllSubject);
router.get('/info/:id', protect, getOne);
router.get('/activities/:id', protect, getActivities);
router.get('/subject-coord/:id', protect, getSubjByCoord)

router.put('/activities/add', protect, addActivities);
router.put('/activities/remove', protect, removeActivity);
router.put('/update-answer', protect, updateAnswers);
router.put('/update-content', protect, updateActivity);
router.put('/update-data', protect, updateData);
router.put('/update-subject', protect, updateSubject)
router.put('/answer/mark', protect, setAnswerMark)

router.post('/add', protect, addSubject);
router.post('/activities/date', protect, getByDate);
router.post('/save', protect, saveAnswer);
router.post('/answers', protect, getAnswers)
router.post('/all-answers', protect, getAllAnswers)

router.delete('/remove', protect, removeSubject);

module.exports = router;