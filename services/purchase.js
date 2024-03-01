const db = require('../Connections/database')

exports.buyPremium =async (order) => {
    return await db.execute("INSERT INTO orders (orderid, status) VALUES (?,?)", [order.id, 'PENDING'])
}

exports.updateTransaction =async (req) =>{
    return await db.execute('UPDATE orders SET paymentid = ?, userid = ?, status = ? WHERE orderid = ?', [req.body.payment_id, req.user[0].id, req.body.status, req.body.order_id])
}

exports.updateUser = async (req)=>{
    return await db.execute('UPDATE users SET ispremium = ? WHERE id = ?', [true, req.user[0].id])
}