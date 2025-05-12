const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({
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
reportMasseges:{
  type:[],
  default: []
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
password: {
  type: String,
  required: true,
  min: 6,
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
role:{
  type:String,
  enum:['normal','admin','super_admin','sales_manger',"Receptionist"],
  default:'normal'
 },
passwordChangedAt:Date,
resetPasswordToken:String,
resetPasswordTokenExpires:Date

},{ timestamps: true })
UserSchema.methods.comparePasswordDB = async function(pass,passDB){
  return await bcrypt.compare(pass,passDB)
}
UserSchema.methods.isPasswordChanged = async function(jwtTimestamp){
  //  console.log(this.passwordChangedAt ,jwtTimestamp )
if(this.passwordChangedAt){
   const passwordChangedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10)
 return jwtTimestamp < passwordChangedTimestamp
}
return false
 
}

module.exports = mongoose.model('DashUser',UserSchema)