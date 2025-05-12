const mongoose = require('mongoose')
const FaqSchema = mongoose.Schema({
 title:{
  type:String,
  required: true,
 },
 answer:{
  type:String,
  required: true,
 }
})
module.exports = mongoose.model('Faq',FaqSchema)


















