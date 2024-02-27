const express = require('express')
const router = express.Router()
const passwordController = require('../Controllers/password')

router.post('/forgotpassword', passwordController.forgotpassword)


router.get('/resetpassword/:forgotpasswordid', passwordController.resetpassword)


router.post('/updatepassword', passwordController.updatepassword)


module.exports = router
