const { removeEmployeer, updateEmployeer, getEmployeer, getAllEmployeer } = require("../controller/webUsers");
const {restrict,isAuth} =require('../meddlewares')
const router = require("express").Router();
router.get('/all',isAuth,restrict(['super_admin']),getAllEmployeer)
router.get('/:id',getEmployeer)
router.put('/:id',updateEmployeer)
router.delete('/:id',restrict(['super_admin']),removeEmployeer)


module.exports = router;