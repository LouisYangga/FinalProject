const express = require('express');
const router = express.Router();
const { exportStudents, importStudents } = require('../controller/studentController');

router.get('/upload', importStudents);
router.get('/download', exportStudents);


module.exports = router;