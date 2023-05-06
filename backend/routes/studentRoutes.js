const express = require('express');
const upload = require("../middlewares/upload");
const router = express.Router();
const { exportStudents, importStudents } = require('../controller/studentController');
const { protect } = require('../middlewares/authToken');

router.post('/upload', protect, upload.single("file"), importStudents);
router.get('/download', exportStudents);


module.exports = router;