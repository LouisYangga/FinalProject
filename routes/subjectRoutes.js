const express = require('express');
const router = express.Router();
const { getStudents } = require('../controller/subjectController');

router.get('/:id', getStudents);

module.exports = router;