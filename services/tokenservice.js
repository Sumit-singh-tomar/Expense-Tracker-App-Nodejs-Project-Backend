const jwt = require('jsonwebtoken')

exports.generateToken = (id, name, ispremium, rowperpage) => {
    return jwt.sign({ userid: id, name, ispremium, rowperpage }, process.env.JWT_SECRET_KEY)
}