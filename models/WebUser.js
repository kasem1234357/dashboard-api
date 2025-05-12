const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
 username: {
  type: String,
  require: true,
  min: 3,
  max: 20,
  unique: true,
},
email: {
  type: String,
  required: true,
  max: 50,
  unique: true,
},
phone:{
  type:Number,
},
globalMessages: [
  { MassegeId:{
  type:mongoose.Schema.Types.ObjectId, ref: 'SystemMasseges' 
},isOpened:{
  type:Boolean,
  default:false
}}],
privateMasseges:{
  type:[],
  default: []
},
profileImg: {
  type: {
    url:String,
    public_id:String,
    galleryName:String,
  },
  default: {
    url:'',
    public_id:'',
    galleryName:''
  },
} ,
prefer:{
   type:[],
},
gender:{
  type:String,
  enum:['male','female'],

},
age:{
  type:Number
},
passwordChangedAt:Date,
resetPasswordToken:String,
resetPasswordTokenExpires:Date,
password: {
  type: String,
  required: true,
  min: 6,
},

},{ timestamps: true })
userSchema.methods.comparePasswordDB = async function(pass,passDB){
  return await bcrypt.compare(pass,passDB)
}
userSchema.methods.isPasswordChanged = async function(jwtTimestamp){
  //  console.log(this.passwordChangedAt ,jwtTimestamp )
if(this.passwordChangedAt){
   const passwordChangedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
 return jwtTimestamp < passwordChangedTimestamp
}
return false
 
}
module.exports = mongoose.model('user',userSchema)