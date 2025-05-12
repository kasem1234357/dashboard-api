const router = require("express").Router();

const User = require('../models/WebUser')
const crypto = require("crypto");
const Tasks = require("../models/Tasks");
const Product = require("../models/Product");
const User = require("../models/User");
const asyncErrorHandler = require("../wrapper_functions/asyncErrorHandler");
const API = require("../classes/Api");
function hashPassword(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  return hash.digest('hex');
}
const updateWebUser =asyncErrorHandler( async(req,res,next)=>{
  const api = new API(req,res)
    
    const password = req.body?.password
  
       const WebUser = await User.findById(req.params.id)
       
       if(password == undefined){
        await WebUser.updateOne({$set:req.body})
       }
       else{
        const hashedPassword = hashPassword(req.body.password);
        const data = {...req.body,password:hashedPassword}
        await WebUser.updateOne({$set:data})
       }
       api.dataHandler('update')
  })
const getAllWebUser = asyncErrorHandler(async(req,res,next)=>{
  const api = new API(req,res)
      // sort should look like this: { "field": "userId", "sort": "desc"}
      const { page = 0, pageSize = 20, sort = null, search = "" } = req.query;
  
      // formatted sort should look like { userId: -1 }
      const generateSort = () => {
        
        const sortParsed = JSON.parse(sort);
        const sortFormatted = {
          [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
        };
  
        return sortFormatted;
      };
      const sortFormatted = Boolean(sort) ? generateSort() : {};
  
      const WebUsers = await User.find({
        $or: [
          { cost: { $regex: new RegExp(search, "i") } },
          { userId: { $regex: new RegExp(search, "i") } },
        ],
      })
        .sort(sortFormatted)
        .skip(page * pageSize)
        .limit(pageSize);
  
      const total = await User.countDocuments({
        name: { $regex: search, $options: "i" },
      });
      api.dataHandler('fetch',{
        WebUsers,
        total,
      })
  })
const getWebUser = asyncErrorHandler(async(req,res,next)=>{
  const api = new API(req,res)
      const WebUser = await User.findById(req.params.id);
      // console.log(req.headers["cookie"].split(' '));
      // log(req.headers)
      // console.log(await DashUser.find());
      // console.log(req.params.id);
      if(WebUser){
        // console.log("hi");
        const {password,...clientData} = WebUser._doc
        
        api.dataHandler('fetch',{...clientData})
        
      }else{
         const error = api.errorHandler('not_found')
         next(error)
      }
     

  })
const removeWebUser = asyncErrorHandler(async(req,res,next)=>{
   const api = new API(req,res)
      const WebUser = await WebUser.findById(req.params.id);
      await WebUser.deleteOne();
      api.dataHandler('delete')
      res.status(200).json("the WebUser has been deleted ");
  })

module.exports = {removeWebUser,getAllWebUser,getWebUser,updateWebUser}