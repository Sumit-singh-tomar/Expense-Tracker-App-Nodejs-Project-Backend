const s3services = require('../services/s3service')
const premiumServices = require('../services/premium')
const db = require('../Connections/database')

exports.showLeaderBoard = async (req, res) => {
    try {
        const result = await premiumServices.showLeaderBoard(req)
        res.status(200).json({ status: true, data: result[0], msg: 'success' })
    }
    catch (e) {
        res.status(500).json({ status: false, data: 'Server Error' })
    }
}

exports.downloadexpense = async (req, res) => {
    try {
        const result = await premiumServices.downloadExpense(req)
        const expense = JSON.stringify(result[0])
        const filename = `Expenses${req.user[0].id}/${new Date()}.txt`
        const fileURL = await s3services.uploadToS3(expense, filename)
        await premiumServices.downloadedfile(fileURL, req)
        res.status(200).json({ status: true, data: fileURL })
    }
    catch (e) {
        res.status(500).json({ status: false, data: 'Server Error' })
    }
}

exports.getExpenseMonthlyWise = async (req, res) => {
    try {
        const result = await premiumServices.getExpenseMontlyWise()
        res.status(200).json({ status: true, data: result[0] })
    }
    catch (e) {
        res.status(500).json({ status: false, data: 'Server Error' })
    }
}

exports.getExpenseWeeklyWise = async (req, res) => {
    try {
        const result = await premiumServices.getExpensWeeklyWise()
        res.status(200).json({ status: true, data: result[0] })
    }
    catch (e) {
        res.status(500).json({ status: false, data: 'Server Error' })
    }
}

exports.getDownloadedFile = async (req, res) => {
    try {
        const result = await db.execute("SELECT *,SUBSTRING(date, 1, 10) as dates FROM downloadedfile WHERE userid = ?", [req.user[0].id])
        res.status(200).json({ status: true, data: result[0] })
    }
    catch (e) {
        res.status(500).json({ status: false, data: 'Server Error' })
    }
}