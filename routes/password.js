const express = require('express')
const SibApiV3Sdk = require('sib-api-v3-sdk')
const defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = "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"

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