const Razorpay = require('razorpay')
const purchaseServices = require('../services/purchase')
const tokenServices = require('../services/tokenservice')

exports.buypremium = (req, res) => {
    try {
        console.log(process.env.RAZORPAY_KEY_ID);

        const rzp = new Razorpay({
            key_id:'rzp_test_J9sf0gIjc8ONfo',
            key_secret:'dQ4g8tUdIQwaDRbwvoK3adF3'
        })

        const amount = 50000000

        rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
            try {
                if (err) {
                    res.status(500).json({ status: false, data: 'RazorPay Error' })
                }
                else {
                    await purchaseServices.buyPremium(order)
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

exports.updatetransactionstatus = (req, res) => {
    try {
        const promise1 = purchaseServices.updateTransaction(req)
        if (req.body.status === 'SUCCESSFUL') {
            const promise2 = purchaseServices.updateUser(req)

            Promise.all([promise1, promise2])
                .then(() => {
                    res.status(200).json({ status: true, data: 'Transaction Successful', token: tokenServices.generateToken(req.user[0].id, req.user[0].name, 1) })
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