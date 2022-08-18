const express = require('express');
const router = express.Router();
const { getStudents, getAllSubject, removeSubject, addSubject, getOne } = require('../controller/subjectController');

router.get('/:id', getStudents);
router.get('/', getAllSubject);
router.get('/info/:id', getOne);

router.post('/add', addSubject);

router.delete('/remove', removeSubject);

module.exports = router;