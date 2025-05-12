const router = require("express").Router();
const { createInviteCode } = require("../controller/auth");
const { restrict, isAuth } = require("../meddlewares");
// const { isAuth } = require("./authMiddleware");

router.post("/",isAuth,restrict(['super_admin']),createInviteCode)

module.exports =router