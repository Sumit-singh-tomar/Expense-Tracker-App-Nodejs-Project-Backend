const db = require('../Connections/database')

exports.userRegister = async (req, hash, query) => {
    return await db.execute(query, [req.body.user_name, req.body.email_id, hash, false])
}

exports.loginUser = async (query, values) => {
    return await db.execute(query, values)
}