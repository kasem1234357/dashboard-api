const { createUser, loginUser, foregetPassword,generateAccessToken, logoutUser, resetPassword } = require("../controller/auth");

const router = require("express").Router();
// const isAuth = require('./authMiddleware').isAuth;
// const isAdmin = require('./authMiddleware').isAdmin;
/*============================================================*/


/*================================================================ */
router.post("/register",createUser );

//LOGIN
 router.post("/login",loginUser );
 router.get('/token',generateAccessToken)
 router.post('/forgetPassword',foregetPassword)
 router.post('/resetPassword',resetPassword)
 router.delete('/logout',logoutUser)

module.exports = router;
