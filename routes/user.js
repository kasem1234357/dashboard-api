const router = require("express").Router();
const {isAuth, restrict} = require('../meddlewares')




const { updateUser, getAllUser, getUser, deleteUser, uploadProfileImg, removeProfileImg, changeRole, sendMsg } = require("../controller/users");
const { getAllMovies } = require("../controller/test");


router.put('/:id',isAuth,updateUser)
router.get('/all',getAllUser)
router.get('/',isAuth,getUser)
router.delete('/profileImg',isAuth,removeProfileImg)
router.delete('/:id',isAuth,restrict(['super_admin']),deleteUser);
router.get('/test',getAllMovies)
router.post('/profileImg',isAuth,uploadProfileImg)
router.post('/role/:id',isAuth,restrict(['super_admin']),changeRole)
router.post('/msg/send',isAuth,restrict(['normal','admin','super_admin','sales_manger']),sendMsg)



/*
router:{mc
39    put,
    get,
    delete,
    
}


*/



module.exports =router