const Sessions = require("../models/Sessions");

module.exports.isAuth = async(req, res, next) => {
     const listOfcookies =req.headers["cookie"].split(' ')
     const session = listOfcookies[0].split('=')[1]
     const isSessionFound = await Sessions.findOne({sessionID:session}) 
 if (isSessionFound) {
    console.log('authinticated');
     next();
 } else {
     res.status(401).json({ msg: 'You are not authorized to view this resource' });
 }
}

module.exports.isAdmin = (req, res, next) => {
 if (req.isAuthenticated() && req.user.admin) {
     next();
 } else {
     res.status(401).json({ msg: 'You are not authorized to view this resource because you are not an admin.' });
 }
}