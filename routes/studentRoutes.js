const express = require('express');
const upload = require("../middlewares/upload");
const router = express.Router();
const { exportStudents, importStudents } = require('../controller/studentController');

router.post('/upload', upload.single("file"), importStudents);
router.get('/download', exportStudents);


module.exports = router;