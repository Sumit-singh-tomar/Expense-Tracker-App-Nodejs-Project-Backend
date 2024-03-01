const db = require('../Connections/database')
const tokenservice = require('../services/tokenservice')
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
        const page = parseInt(req.query.page);
        const itemPerPage = parseInt(req.query.itemperpage)
        console.log(itemPerPage)
        await db.execute('UPDATE users SET rowperpage = ? WHERE id = ?', [itemPerPage, req.user[0].id])
        const totalrecords = await db.execute('SELECT COUNT(*) AS totalrecords FROM expense WHERE userid = ?', [req.user[0].id])
        const result = await db.execute(`SELECT *, SUBSTRING(date, 1, 10) AS dates FROM expense WHERE userid = ? LIMIT ${itemPerPage} OFFSET ${(page - 1) * itemPerPage}`, [req.user[0].id])
        const pageData = {
            currentpage: page,
            previouspage: page > 1 ? page - 1 : false,
            nextpage: ((page - 1) * itemPerPage) + itemPerPage < totalrecords[0][0].totalrecords ? parseInt(page) + 1 : false,
            ispreviouspage: page == 1 ? false : true,
            isnextpage: ((page - 1) * itemPerPage) + itemPerPage < totalrecords[0][0].totalrecords,
        }
        res.status(200).json({ status: true, data: result[0], pageData, token:tokenservice.generateToken(req.user[0].id, req.user[0].name, req.user[0].ispremium, itemPerPage) })
    } catch (e) {
        console.log(e);
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