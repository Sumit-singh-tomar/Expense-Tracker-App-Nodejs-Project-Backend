const express = require('express')
const router = express.Router()
const authentication = require('../middleware/auth')
const premiumController = require('../Controllers/premium')

router.get('/show-leaderboard', authentication, premiumController.showLeaderBoard)

router.get('/downloadexpense', authentication, premiumController.downloadexpense)

router.get('/get-expense-monthly-wise', authentication, premiumController.getExpenseMonthlyWise)

router.get('/get-expense-Weekly-wise', authentication, premiumController.getExpenseWeeklyWise)

router.get('/get-downloaded-file', authentication, premiumController.getDownloadedFile)


module.exports = router;