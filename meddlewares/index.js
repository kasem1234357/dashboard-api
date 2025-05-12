const requestTime =require('./requestTime') 
const globalHandleError = require('./errorController')
const isAuth = require('./isAuth')
const restrict = require('./restrict')
module.exports = {
    requestTime,
    globalHandleError,
    isAuth,
    restrict
}