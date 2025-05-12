const mongoose = require("mongoose");
const SystemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      require: true,
      
    },
    title:{
      type:String,
      require:true
    },
    subTitle:{
      type:String,
      require:true
    },
    isPrivate:{
        type:Boolean,
        default:false,
        require:true
    },
    data:{
       type:'string',
       default:''
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
module.exports = mongoose.model("SystemMasseges", SystemSchema);
