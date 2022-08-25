const express = require('express');
const router = express.Router();
const { loginUser, registerUser, changePass, updateDetails, getUser, getUsers, removeUser, resetPass, email } = require('../controller/userController');
const { getChildren } = require('../controller/parentController');
const { enrollStudent } = require('../controller/teacherController');

router.post('/login', loginUser);
router.post('/', registerUser);
router.post('/email', email);

router.put('/change-pass', changePass);
router.put('/update-details', updateDetails);
router.put('/teacher/enroll', enrollStudent);
router.put('/reset/:id', resetPass);

router.get('/find/:field/:data', getUser);
router.get('/users', getUsers);
router.get('/parent/children/:id', getChildren);


router.delete('/remove', removeUser)
module.exports = router;