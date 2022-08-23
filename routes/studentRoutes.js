const express = require('express');
const router = express.Router();
const { exportStudents } = require('../controller/studentController');

router.get('/download', exportStudents);


module.exports = router;