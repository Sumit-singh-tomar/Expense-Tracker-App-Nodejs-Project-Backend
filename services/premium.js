const db = require('../Connections/database')

exports.showLeaderBoard = async () => {
    return await db.execute("SELECT name, totalexpense FROM users ORDER BY totalexpense DESC")
}

exports.downloadExpense = async (req) => {
    return await db.execute("SELECT * FROM expense WHERE userid = ?", [req.user[0].id])
}

exports.getExpenseMontlyWise = async () => {
    return await db.execute("select monthname(date) as monthname,sum(amount) as amt,sum(income) as income from expense where userid = 17 group by month(date)")
}


exports.getExpensWeeklyWise = async () => {
    return await db.execute("SELECT WEEK(date) AS week,SUM(amount) as amt,monthname(date) as monthname,sum(income) as income FROM expense WHERE userid = 17 GROUP BY MONTH(date)")
}

exports.getExpensWeeklyWise = async () => {
    return await db.execute("SELECT WEEK(date) AS week,SUM(amount) as amt,monthname(date) as monthname,sum(income) as income FROM expense WHERE userid = 17 GROUP BY MONTH(date)")
}

exports.downloadedfile = async (fileURL, req) => {
    return await db.execute("INSERT INTO downloadedfile (fileurl, userid, date) VALUES (?,?,?)", [fileURL, req.user[0].id,new Date()])
}