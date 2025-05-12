const router = require("express").Router();
const {isAuth, restrict} = require('../meddlewares')




const { updateUser, getAllUser, getUser, deleteUser, uploadProfileImg, removeProfileImg, changeRole } = require("../controller/users");
const { getAllMovies } = require("../controller/test");


router.put('/:id',isAuth,updateUser)
router.get('/all',getAllUser)
router.get('/',isAuth,getUser)
router.delete('/profileImg',isAuth,removeProfileImg)
router.delete('/:id',isAuth,restrict(['super_admin']),deleteUser);
router.get('/test',getAllMovies)
router.post('/profileImg',isAuth,uploadProfileImg)
router.post('/role/:id',isAuth,restrict(['super_admin']),changeRole)



/*
router:{
    put,
    get,
    delete,
    
}


*/



module.exports =router