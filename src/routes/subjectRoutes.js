const express = require('express');
const router = express.Router();
const { getStudents, getAllSubject, removeSubject, addSubject, getOne } = require('../controller/subjectController');
const { getActivities, addActivities, removeActivity, getByDate } = require('../controller/contentController');
router.get('/:id', getStudents);
router.get('/', getAllSubject);
router.get('/info/:id', getOne);
router.get('/activities/:id', getActivities);

router.put('/activities/add', addActivities);
router.put('/activities/remove', removeActivity);

router.post('/add', addSubject);
router.post('/activities/date', getByDate);

router.delete('/remove', removeSubject);

module.exports = router;