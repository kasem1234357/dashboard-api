const router = require("express").Router();

const { getTransactions,postTransaction} = require("../controller/transactions");

router.get('/',getTransactions)   
router.post('/',postTransaction)
router.get('/all',)


module.exports = router