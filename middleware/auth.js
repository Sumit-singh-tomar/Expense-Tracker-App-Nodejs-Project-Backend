const db =require('../Connections/database')
const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY)
        db.execute('SELECT * FROM users WHERE id = ?',[user.userid])
            .then((result) => {
                req.user = result[0]
                next()
            })
            .catch((e)=>{
                res.status(401).json({status:false,data:'User Not Authorized'})
            })
    }
    catch(e){
        res.status(500).json({status:false,data:'Server Error'})
    }
}

module.exports = authenticate;