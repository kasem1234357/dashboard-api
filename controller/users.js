

const crypto = require("crypto");
const Tasks = require("../models/Tasks");
const hashPassword = require('../utils/hashPassword')
const Product = require("../models/Product");
const DashUser = require("../models/User");
const asyncErrorHandler = require("../wrapper_functions/asyncErrorHandler");
const API = require('../classes/Api');
const { signToken, cloudinaryUpload, cloudinaryDelete } = require('../utils');
const Token = require('../models/Token');
const { log } = require('console');
const getUser = asyncErrorHandler(async(req,res,next)=>{
      
      const api = new API(req, res);
      //api.logRequest()
      const user = await DashUser.findById(req.user._id);
      if(user){
        const {password,...clientData} = user._doc
        const taskNumber = await Tasks.count()
        const productNumber = await Product.count()
         // generate access token
    const accessToken = signToken(user._id);
    // generate refresh token
    const refreshToken = signToken(user._id, "refresh");
    // check if previous refresh token still found and deleted
    await Token.findOneAndDelete({userId:user._id})
  
    // store new refresh token in database
    await Token.create({token:refreshToken,userId:user._id})
    api.setCookie({ refreshToken }, {
      httpOnly: false,
      secure: false, // Set to true in production
      sameSite: 'lax', // Adjust based on your needs
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
 
  
        api.dataHandler('fetch',{...clientData,taskNumber,productNumber,accessToken})
      }else{
        const error = api.errorHandler('not_found')
        next(error)
      }
     
    
  })
const updateUser = asyncErrorHandler(async(req,res,next)=>{
  const api = new API(req, res);
    const password = req.body?.password
       const user = await DashUser.findById(req.params.id)
       if(password == undefined){
        await user.updateOne({$set:req.body})
       }
       else{
        const hashedPassword = hashPassword(req.body.password);
        const data = {...req.body,password:hashedPassword}
        await user.updateOne({$set:data})
       }
       api.dataHandler('update',null,'updated user informations')
  })
const getAllUser = asyncErrorHandler(async(req,res,next)=>{
  const api = new API(req, res);
  
  
  api.modify(DashUser.find()).filter().sort().limitFields(['role','profileImg','username']).paginate()
  const users = await api.query
  const total = await DashUser.countDocuments()
      api.dataHandler('fetch',{
        users,
        total,
      })
  })
const deleteUser = asyncErrorHandler(async(req,res,next)=>{
  const api = new API(req, res);
  
  
      const user = await DashUser.findById(req.params.id);
      const error = api.errorHandler('Forbidden','cloudenary cant remove this img')
      if(!user){
        const error = api.errorHandler('not_found')
        next(error)
      }
      
      if(user?.profileImg?.public_id !== '' && user?.profileImg?.galleryName !== ''){
        await cloudinaryDelete([`${user?.profileImg?.galleryName}/${user?.profileImg?.public_id}`],()=> next(error))
      } 
      await user.deleteOne();
      api.dataHandler('delete',"the user has been deleted ")
     
       
      
      
     
  })
const uploadProfileImg = asyncErrorHandler(async(req,res,next)=>{
   const api = new API(req, res);
   console.log(req.user);
   
   const user = req.user
   const {profileImg,galleryName,public_id} = req.body
   console.log(profileImg);
   console.log(galleryName);
   
   let imgUrl = await cloudinaryUpload(profileImg,galleryName,public_id);
   console.log(imgUrl);
   
   if(imgUrl){
    await user.updateOne({$set:{profileImg:{
      url: imgUrl.secure_url,
      public_id:imgUrl.public_id,
      galleryName:galleryName
    }}})
    api.dataHandler('update',{
       url: imgUrl.secure_url,
       public_id:imgUrl.public_id,
       galleryName:galleryName,
    })
   }
   else{
    const error = api.errorHandler('server_error','error in cloudinary upload')
    next(error)
   }

})
const removeProfileImg = asyncErrorHandler(async (req,res,next)=>{
  

   const api = new API(req, res);
   const user = req.user
  
   const result = await cloudinaryDelete([`${user?.profileImg?.galleryName}/${user?.profileImg?.public_id}`],()=> next(error))
   if(result){
    await user.updateOne({$set:{profileImg:{
      url:'',
      public_id:'',
      galleryName:''
   }}})
   api.dataHandler('delete',null,"the profile image has been deleted")
   }else{
    
    next(error)
   }
   
    

})
const changeRole = asyncErrorHandler(async(req,res,next)=>{
  const api = new API(req, res);
   const user = req.user
   const employeeId = req.params.id
   if(user._id === employeeId){
    const error = api.errorHandler('invalid','you cant change your role')
    next(error)
   }
   const employee = await DashUser.findById(employeeId)
if(!employee){
  const error = api.errorHandler('not_found')
  next(error)
}
   if(employee.role === 'super_admin'){
    const error = api.errorHandler('unauthorized',"you can't change role for user with super_admin role")
    next(error)
   }
   await employee.updateOne({$set:{
    role:req.body.role
   }})
   api.dataHandler('update')
})

  module.exports = {
    getAllUser,getUser,updateUser,deleteUser,uploadProfileImg,removeProfileImg,changeRole
  }