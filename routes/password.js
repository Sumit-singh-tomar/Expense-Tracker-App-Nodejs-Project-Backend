const express = require('express')
const SibApiV3Sdk = require('sib-api-v3-sdk')
const defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];


const router = express.Router()

router.post('/forgotpassword', (req, res) => {
    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi()

    const sender = {
        email: 'sumitsinght09@gmail.com',
        name:'Sumit Singh'
    }

    const receivers = [
        {
            email: 'sumitsinght10@gmail.com'
        }
    ]

    tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: 'Subject to send email testing',
        textContent: 'This is first email by the sumit to sumit'
    }).then((data) => {
        console.log('data that is send', data);
    }).catch((e) => {
        console.log('e of data', e);
    })
})

module.exports = router
