const db = require('../Connections/database')

exports.showLeaderBoard = async (req, res) => {
    try {
        const result = await db.execute("SELECT name, totalexpense FROM users ORDER BY totalexpense DESC")

        res.status(200).json({ status: true, data: result[0], msg:'succes' })
    }
    catch (e) {
        res.status(500).json({ status: false, data: 'Server Error' })
    }
}