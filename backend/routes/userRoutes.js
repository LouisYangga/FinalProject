const express = require('express');
const router = express.Router();
const {
    loginUser,
    registerUser,
    changePass,
    updateDetails,
    getUser,
    getUsers,
    removeUser,
    resetPass,
    email,
    getStudents,
    colorStrings,
    updateStatus,
    uploadLogo,
    getLogo,
    getTeachers
} = require('../controller/userController');
const { getChildren } = require('../controller/parentController');
const { enrollStudent, addSubjToTeacher } = require('../controller/teacherController');
const { protect } = require('../middlewares/authToken');
const upload = require("../middlewares/upload");


router.post('/login', loginUser);
router.post('/', registerUser);
router.post('/email', protect, email);
router.post('/colors', protect, colorStrings);
router.post('/image', upload.single("file"), uploadLogo);


router.put('/change-pass', protect, changePass);
router.put('/update-details', protect, updateDetails);
router.put('/teacher/enroll', protect, enrollStudent);
router.put('/reset/:id', resetPass);
router.put('/update-status', updateStatus);
router.put('/teacher/subject', protect,addSubjToTeacher);


router.get('/find/:field/:data', protect, getUser);
router.get('/users', protect, getUsers);
router.get('/students', protect, getStudents);
router.get('/parent/children/:id', protect, getChildren);
router.get('/teachers', getTeachers);
router.get('/logo/:name', getLogo);


router.delete('/remove', removeUser)
module.exports = router;