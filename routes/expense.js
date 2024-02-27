const express = require('express')
const router = express.Router()
const expenseController = require('../Controllers/expense')
const authentication = require('../middleware/auth')

router.post('/add-expense',authentication, expenseController.addExpense)

router.get('/get-expense', authentication, expenseController.getExpense)

router.delete('/delete-expense/:id/:amount',authentication, expenseController.deleteExpense)

module.exports = router;