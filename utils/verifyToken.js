
const jwt = require("jsonwebtoken");
const util = require('util')
const verifyToken = async (token,secret)=>{
    try {
        return await util.promisify(jwt.verify)(token,secret)
    } catch (error) {
        return error 
    }
    
}

module.exports = verifyToken