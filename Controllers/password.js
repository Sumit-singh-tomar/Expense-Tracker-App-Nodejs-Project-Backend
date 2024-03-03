const { v4: uuidv4 } = require('uuid');
const db = require('../Connections/database')
const SibApiV3Sdk = require('sib-api-v3-sdk')
const bcrypt = require('bcrypt')

exports.forgotpassword = (req, res) => {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    var apiKey = defaultClient.authentications['api-key'];

    apiKey.apiKey = process.env.SANDINBLUE_API_KEY

    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi()

    const sender = {
        email: 'ss@gmail.com',
        name: 'Sumit Singh Tomar'
    }

    const receivers = [
        {
            email: 'sumitsinght10@gmail.com'
        }
    ]

    const uuid = uuidv4()

    tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: 'reset password',
        htmlContent: `
        <div>This is below link to reset your password</div>
        <a href=http://localhost:3000/password/resetpassword/${uuid}>reset password</a>`
    }).then(async (data) => {
        try {
            const result = await db.execute('SELECT id FROM users WHERE emailid = ?', [req.body.email_id])
            await db.execute('INSERT INTO forgotpasswordrequests (id, userid, isactive) VALUES (?,?,?)', [uuid, result[0][0].id, false])
            res.status(200).json({ status: true, data: 'Message sends to Your Email',registerEmail:req.body.email_id })
        }
        catch (e) {
            res.status(500).json({ status: false, data: 'Database Error' })
        }
    }).catch((e) => {
        res.status(500).json({ status: false, data: 'Something Went Wrong' })
    })
}


exports.resetpassword = async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM forgotpasswordrequests WHERE id = ?', [req.params.forgotpasswordid])
        if (result[0][0].id === req.params.forgotpasswordid) {
            await db.execute('UPDATE forgotpasswordrequests SET isactive = ? WHERE id = ?', [true, req.params.forgotpasswordid])
            res.status(200).send(`
            <form action='http://localhost:3000/password/updatepassword' method="POST">
                <h2>Add New Password</h2>
                <input type='text' id='newpassword' name='newpassword' placeholder='Enter New Password' />
                <input type='hidden' id='uid' name='uid' value=${result[0][0].userid} /> 
                <input type='hidden' id='forgotpasswordid' name='forgotpasswordid' value=${result[0][0].id} /> 
                <button type="submit">Change Password</button>
            </form>
            `)
        }
        else {
            res.status(500).json({ status: false, data: 'Something Went Wrong' })
        }
    }
    catch (e) {
        res.status(500).json({ status: false, data: 'Something Went Wrong' })
    }
}

exports.updatepassword =async (req, res) => {
    const connection = await db.getConnection()
    bcrypt.hash(req.body.newpassword, 10, async (err, hash) => {
        try {
            await connection.beginTransaction()
            await connection.execute('UPDATE users SET password = ? WHERE id = ?', [hash, req.body.uid])
            await connection.execute('UPDATE forgotpasswordrequests SET isactive = ? WHERE id = ?', [false, req.body.forgotpasswordid]);
            await connection.commit();
            res.status(200).send(`
            <h3>Your password Successfully Changed</h3>
            <a style="text-decoration:none;font-size:20px;font-weight:bold" href="http://127.0.0.1:5500/login/login.html ">Back To Login</a>`);
        } catch (e) {
            await connection.rollback()
            res.status(500).json({ status: false, data: 'Something Went Wrong' })
        }
        finally{
            connection.release()
        }
    })
}

