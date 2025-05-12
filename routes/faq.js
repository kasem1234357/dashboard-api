const { createFaq, getFaq, getSingleFaq ,sendToSupportTeam} = require("../controller/faq");
const {restrict,isAuth} =require('../meddlewares')
const router = require("express").Router();


// add Faq
router.post('/',createFaq)
// get all Faq

router.get('/',getFaq)
router.get('/:id',getSingleFaq)





module.exports =router