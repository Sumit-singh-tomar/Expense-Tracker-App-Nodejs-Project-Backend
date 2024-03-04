const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const registerServices = require('../services/register')
const tokenservice = require('../services/tokenservice')

exports.userRegisteration = (req, res) => {
    const query = "INSERT INTO users (name, emailid, password, ispremium) VALUES (?,?,?,?)"
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
        try {
            await registerServices.userRegister(req, hash, query)
            res.status(200).json({ status: true, data: 'User Registeration Succesfully' })
        }
        catch (e) {
            if (e.code === 'ER_DUP_ENTRY')
                res.status(500).json({ status: false, data: 'User Already Exist' })
            else
                res.status(500).json({ status: false, data: 'Server Error' })
        }
    })
}

exports.loginUser = async (req, res) => {
    try {
        const query = "SELECT * FROM users WHERE emailid = ?";
        const values = [req.body.email_id]
        const result = await registerServices.loginUser(query, values)

        if (result[0].length === 0) {
            res.status(404).json({ status: false, data: 'User Not Found' })
        }
        else {
            bcrypt.compare(req.body.password, result[0][0].password, (err, response) => {
                console.log(response)
                if (response) {
                    res.status(200).json({ status: true, data: result[0], token: tokenservice.generateToken(result[0][0].id, result[0][0].name, result[0][0].ispremium, result[0][0].rowperpage) })
                }
                else {
                    res.status(401).json({ status: false, data: 'User not Authorized, Incorrect Password' })
                }
            })
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ status: false, data: 'server error' })
    }
}