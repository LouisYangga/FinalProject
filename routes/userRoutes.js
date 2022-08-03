const express = require('express');
const { getChildren } = require('../controller/parentController');
const router = express.Router();
const { loginUser, registerUser, changePass, updateDetails, getUser, getUsers } = require('../controller/userController');

router.post('/login', loginUser);
router.post('/', registerUser);
router.put('/change-pass', changePass);
router.put('/update-details', updateDetails);
router.get('/find', getUser);
router.get('/users', getUsers);
router.get('/parent/children', getChildren);

module.exports = router;