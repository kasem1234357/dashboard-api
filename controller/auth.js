const API = require("../classes/Api");
const { GET_RESET_PASSWORD_URL } = require("../constraints/CONSTANTS");
const dotenv = require("dotenv");
const InviteCode = require("../models/InviteCode");
const Product = require("../models/Product");
const ResetToken = require("../models/ResetToken");
const Sessions = require("../models/Sessions");
const Tasks = require("../models/Tasks");
const User = require("../models/User");
const { generateResetToken, sendToEmail, signToken, verifyToken } = require("../utils");
const comparePasswords = require("../utils/comparePasswords");
const hashPassword = require("../utils/hashPassword");
const asyncErrorHandler = require("../wrapper_functions/asyncErrorHandler");
const Token =require('../models/Token')
dotenv.config();
const createUser = asyncErrorHandler(async (req, res,next) => {
  const api = new API(req,res)
    const hashedPassword = hashPassword(req.body.password);
    const checkEmail = await User.findOne({ email: req.body.email });
    const checkName = await User.findOne({username:req.body.userName});
    const inviteState = await InviteCode.findOne({code :req.body.inviteCode}) 
    const isInvite = (inviteState && inviteState.state === true) || req.body.inviteCode === "SuperAdmin@1234"
  
    //generate new password
    if(checkEmail ){
      const error = api.errorHandler("invalid","email is taken")
      next(error)
    }
    else if(checkName){
     console.log(req.body.userName);
     const error = api.errorHandler("invalid","name is taken")
      next(error)
    }
    else if(!isInvite ){
      const error = api.errorHandler('Forbidden',"you are not invited")
     next(error)
    }
 
    else{
      
     const newUser = new User({
       username: req.body.userName,
       email: req.body.email,
       password: hashedPassword,
       role:inviteState?.role || 'super_admin'
     });
     // create access token
  const accessToken = signToken(newUser._id);
  // create refresh token
  const refreshToken = signToken(newUser._id, "refresh");
  // store refresh token in database
   const newToken = await Token.create({token:refreshToken,userId:newUser._id})
   // send request to the client 
   await newUser.save()
  api.dataHandler("create", { accessToken, refreshToken:newToken.token, user: newUser });
    

    }

 })
const loginUser = asyncErrorHandler(async (req, res,next) => {
  const api = new API(req,res)
     const user = await User.findOne({ email: req.body.email });
     let validPassword = ''
     if(user){
       validPassword = comparePasswords(req.body.password, user.password)
     }
  
     if(!user ){
      
      const error =api.errorHandler('not_found',"user not found")
       next(error)
      }
     else if(!validPassword || undefined || validPassword === null){
      const error =api.errorHandler('invalid',"wrong password")
       next(error)
     }
     else{
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
    const newToken = await Token.create({token:refreshToken,userId:user._id})
    api.setCookie({ refreshToken:newToken.token });
  api.dataHandler('fetch',{...clientData,taskNumber,productNumber,accessToken, refreshToken:newToken.token})
   
   
 
     }
   })
const generateAccessToken = asyncErrorHandler(async (req, res, next) => {
    
    const api = new API(req, res);
    //api.logRequest()
    const refreshToken =api.getCookie('refreshToken')
    console.log("121 " +refreshToken)
    if (!refreshToken ){
      const error = api.errorHandler('unauthorized','your refreshToken not found')
      next(error)
    };
    let decodedToken =await verifyToken(refreshToken,process.env.REFRESH_TOKEN_SECRET)
    if(!decodedToken){
      const error = api.errorHandler('unauthorized')
      next(error)
    }
     const token = await Token.findOne({userId:decodedToken.id})
   
   
    
    if (!token || refreshToken !== token.token){
      const error = api.errorHandler('unauthorized','your token not valid anymore')
      next(error)
    }else{
      const accessToken = signToken(decodedToken.id);
      api.dataHandler("create", { accessToken},'new access token has been created');
    }
    
  });
const createInviteCode = asyncErrorHandler(async(req,res,next)=>{
  const api = new API(req,res)
  console.log(req.user);
   const newCode = new InviteCode({
    code:req.body.inviteCode,
    role:req.body.role,
    state:true
   })
   await newCode.save();
   console.log("done");
   api.dataHandler('create',null,'your invite code work now')
  
  })
  const foregetPassword = asyncErrorHandler(async (req,res,next)=>{
    const api = new API(req,res)
    const user = await User.findOne({email:req.body.email})
    
    
    if(!user){
      const error = api.errorHandler('not_found','user not found check if the email correct')
      next(error)
    }
    const resetToken = generateResetToken()
    const newResetToken = await ResetToken.create({
      userID:user._id,
      token:resetToken
    })
  await newResetToken.save()
    
    const result = await sendToEmail({
      email:req.body.email,
      subject:'Reset Password',
      isTemplate:false,
      message:GET_RESET_PASSWORD_URL(`${process.env.FRONT_URL}/forgetPassword/${resetToken}`)
    })

    if(result){
      api.dataHandler('create','reset token created its valid for 15 min')
    }else{
      await ResetToken.findByIdAndDelete(newResetToken._id)
      const error = api.errorHandler('uncomplated_data','something going wrong with send to email operation')
      next(error)
      
    }  
  })
  const resetPassword =asyncErrorHandler(async(req,res,next)=>{
    const api = new API(req,res)
    const resetUserToken = await ResetToken.find({token:req.body.resetToken})
    console.log(resetUserToken);
    
    if(!resetUserToken){
      const error = api.errorHandler('invalid','your token in invalid')
      next(error)
    }
    const currentUser = await User.findById(resetUserToken[0].userID)
    if(!currentUser){
      const error = api.errorHandler('not_found','user not found')
      next(error)
    }
    if(req.body.newPassword.length === 0){
      const error = api.errorHandler('uncomplated_data')
      next(error)
    }
    const newHashedPassword = hashPassword(req.body.newPassword)
    
    await currentUser.updateOne({$set:{password:newHashedPassword}})
    api.dataHandler('update')
  })
  const logoutUser = asyncErrorHandler(async (req,res,next)=>{
    const api = new API(req,res)
    const refreshToken = api.getCookie('refreshToken')
    if(!refreshToken){
      const error = api.errorHandler('unauthorized','your refreshToken not found')
      next(error)
    }
    let decodedToken =await verifyToken(refreshToken,process.env.REFRESH_TOKEN_SECRET)
    if(!decodedToken){
       
      const error = api.errorHandler('unauthorized')
      next(error)
    }
    const token = await Token.findOne({userId:decodedToken.id})
    if (!token || refreshToken !== token.token){
      const error = api.errorHandler('unauthorized','your token not valid anymore')
      next(error)
    }else{
      await Token.findByIdAndDelete(token._id)
      api.dataHandler('delete','your token has been deleted')

    }
  })
   module.exports = {
    createUser,loginUser,createInviteCode,foregetPassword,generateAccessToken,resetPassword,logoutUser
   }