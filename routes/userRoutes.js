const express = require('express');
const router = express.Router();
const { loginUser, registerUser, changePass, updateDetails } = require('../controller/userController');

router.post('/login', loginUser);
router.post('/', registerUser);
router.put('/change-pass', changePass);
router.put('/update-details', updateDetails);

module.exports = router;