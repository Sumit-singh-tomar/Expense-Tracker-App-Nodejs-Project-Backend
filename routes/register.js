const express = require('express')
const router = express.Router()
const registerController = require('../Controllers/register')

router.post('/user-register', registerController.userRegisteration)

router.post('/login-user', registerController.loginUser)

module.exports = router;