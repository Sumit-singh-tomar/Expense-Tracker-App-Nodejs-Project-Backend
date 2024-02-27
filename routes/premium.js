const express = require('express')
const router = express.Router()
const authentication = require('../middleware/auth')
const premiumController = require('../Controllers/premium')

router.get('/show-leaderboard', authentication, premiumController.showLeaderBoard)

module.exports = router;