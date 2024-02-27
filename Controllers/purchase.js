const Razorpay = require('razorpay')
const db = require('../Connections/database')
const jwt = require('jsonwebtoken')

exports.buypremium = (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id: 'rzp_test_Rw1I9P8xfDyfng',
            key_secret: 'rVHYzHF2javiwUtmIlzJymLK'
        })

        const amount = 50000000

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            try {
                if (err) {
                    res.status(500).json({ status: false, data: 'RazorPay Error' })
                }
                else {
                    await db.execute("INSERT INTO orders (orderid, status) VALUES (?,?)", [order.id, 'PENDING'])
                    res.status(200).json({ status: true, order, key_id: rzp.key_id })
                }
            } catch (e) {
                res.status(500).json({ status: false, data: 'Database Error' })
            }
        })

    } catch (err) {
        res.status(500).json({ status: false, data: 'Server Error' })
    }
}

function generateToken(id, name, ispremium) {
    return jwt.sign({ userid: id, name: name, ispremium: ispremium }, 'secretkey')
}

exports.updatetransactionstatus = (req, res) => {
    try {
        const promise1 = db.execute('UPDATE orders SET paymentid = ?, userid = ?, status = ? WHERE orderid = ?', [req.body.payment_id, req.user[0].id, req.body.status, req.body.order_id])
        if (req.body.status === 'SUCCESSFUL') {
            const promise2 = db.execute('UPDATE users SET ispremium = ? WHERE id = ?', [true, req.user[0].id])

            Promise.all([promise1, promise2])
                .then(() => {
                    res.status(200).json({ status: true, data: 'Transaction Successful', token: generateToken(req.user[0].id, req.user[0].name, 1) })
                })
                .catch((e) => {
                    res.status(500).json({ status: false, data: 'Database Error' })
                })
        }
        else {
            promise1.then(() => {
                res.status(200).json({ status: true, data: 'Transaction Failed' })
            })
                .catch((e) => {
                    res.status(500).json({ status: false, data: 'Database Error' })
                })
        }
    } catch (e) {
        res.status(500).json({ status: false, data: 'Server Error' })
    }

}