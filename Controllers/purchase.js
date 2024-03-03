const Razorpay = require('razorpay')
const purchaseServices = require('../services/purchase')
const tokenServices = require('../services/tokenservice')

exports.buypremium = (req, res) => {
    try {
        const rzp = new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_SECRET_KEY,
        })

        const amount = 50000000;

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
        console.log(err);
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
                    res.status(200).json({ status: true, data: 'Transaction Successful', token: tokenServices.generateToken(req.user[0].id, req.user[0].name, 1, req.user[0].rowperpage) })
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