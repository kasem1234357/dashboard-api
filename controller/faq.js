const API = require('../classes/Api');
const { SUPPORT_EMAIL_TEMPLATE, MSG_TYPE } = require('../constraints/CONSTANTS');
const Faq = require('../models/Faqs');
const { sendToEmail } = require('../utils');
const asyncErrorHandler = require('../wrapper_functions/asyncErrorHandler');
const createFaq =asyncErrorHandler(async(req,res)=>{
    const faq = new Faq(req.body)
const api = new API(req,res)
      await faq.save()
      api.dataHandler('create')
   })
const getFaq = asyncErrorHandler(async(req,res)=>{
  const api = new API(req,res)
      const faqs = await Faq.find();
      api.dataHandler('fetch',faqs)
   })
const getSingleFaq = asyncErrorHandler(async(req,res,next)=>{
  const api = new API(req,res)
     const faq = await Faq.findById(req.params.id)
     if(faq){
      api.dataHandler('fetch',faq)

     }else{
      const error = api.errorHandler('not_found')
      next(error)
     }

})
const sendToSupportTeam = asyncErrorHandler(async(req,res,next)=>{
   const api = new API(req,res)
   const {email,text,title,type} = req.body
   console.log(email,text,title,type)
   
   const result = await sendToEmail({
      email:'mohammadhsian2005@gmail.com',
      subject:title,
      isTemplate:true,
      template:SUPPORT_EMAIL_TEMPLATE.replace('{{subject}}', title).replace('{{message}}', text).replace('{{type}}', MSG_TYPE[type]).replace('{{from}}',email)
    })

    if(result){
      api.dataHandler('fetch','message has been sent')
    }else{     
      const error = api.errorHandler('uncomplated_data','something going wrong with send to email operation')
      next(error)
      
    }
 //  const supportTeam = await User.find({role:'support_team'})
   // supportTeam.forEach(async(user)=>{
   //    await axios.post(`https://api.whatsapp.com/send?phone=${user.phoneNumber}&text=${message}`)
   // })
})
   module.exports = {
    createFaq,getFaq,getSingleFaq,sendToSupportTeam
   }