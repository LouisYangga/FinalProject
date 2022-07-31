const express = require('express');
const router = express.Router();
const { loginUser, registerUser, changePass } = require('../controller/userController');

router.post('/login', loginUser);
router.post('/', registerUser);
router.put('/change-pass', changePass);

module.exports = router;