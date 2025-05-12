const { getOverallStats, createOverallStat } = require("../controller/sales");
const { restrict,isAuth } = require("../meddlewares");

const router = require("express").Router();
router.get('/',isAuth,restrict(['super_admin','sales_manger']),getOverallStats)
router.post('/',createOverallStat)
module.exports = router