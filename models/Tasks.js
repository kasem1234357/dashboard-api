const mongoose = require("mongoose");
const TaskSchema = mongoose.Schema({
 title:{
  type:String,
  max:100
 },
 desc:{
  type:Array,
  default:['']
 },
 progress:{
  type:Number,
  default:0,
  min:0
 },
 tag:{
  type:String,
  default:'grneral'
 },
 progressColor:{
  type:String,
  default:'#00d4fa'
 },
 tagColor:{
  type:String,
  default:'#d9234b'
 },
 state:{
  type:String,
  default:"To do"
 },
 remainder:{
  type:Boolean,
  default:false
 },
 reminderDate:{
    type:String,
    default:''
 },
 tasks:{
  type:Array,
  default:[]
 }
 
 
},{ timestamps: true })
module.exports = mongoose.model("Tasks", TaskSchema);