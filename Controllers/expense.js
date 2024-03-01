const db = require('../Connections/database')

exports.addExpense = async (req, res) => {
    const connection = await db.getConnection()
    try {
        await connection.beginTransaction();
        if (req.body.expense_name === 'Salary')
            await connection.execute("INSERT INTO expense (expense_name, income, description, userid,date) VALUES (?,?,?,?,?)", [req.body.expense_name, req.body.amount, req.body.description, req.user[0].id, new Date()])
        else {
            await connection.execute("INSERT INTO expense (expense_name, amount, description, userid,date) VALUES (?,?,?,?,?)", [req.body.expense_name, req.body.amount, req.body.description, req.user[0].id, new Date()])
            await connection.execute("UPDATE users SET totalexpense = ? WHERE id = ?", [parseInt(req.user[0].totalexpense) + parseInt(req.body.amount), req.user[0].id])
        }
        await connection.commit();
        res.status(200).json({ status: true, data: 'Expense Added Successfully' })
    } catch (e) {
        await connection.rollback()
        console.log('e', e);
        res.status(500).json({ status: false, data: 'server error' })
    }
    finally {
        connection.release()
    }
}

exports.getExpense = async (req, res) => {
    try {
        const result = await db.execute("SELECT *,SUBSTRING(date, 1, 10) AS dates FROM expense WHERE userid = ?", [req.user[0].id])
        res.status(200).json({ status: true, data: result[0] })
    } catch (e) {
        res.status(500).json({ status: false, data: 'server error' })
    }
}

exports.deleteExpense = async (req, res) => {
    const connection = await db.getConnection()
    try {
        await connection.beginTransaction()
        await connection.execute("DELETE FROM expense WHERE id = ? and userid = ?", [req.params.id, req.user[0].id])
        await connection.execute("UPDATE users SET totalexpense = ? WHERE id = ?", [req.user[0].totalexpense - req.params.amount, req.user[0].id])
        await connection.commit()
        res.status(200).json({ status: true, data: 'Expense Successfully Deleted' })
    } catch (e) {
        await connection.rollback()
        res.status(500).json({ status: false, data: 'server error' })
    }
    finally {
        connection.release()
    }
}