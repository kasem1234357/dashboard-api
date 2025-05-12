const mongoose = require("mongoose");
const ReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    subTitle:{
        type: String,
        require: false,
    },
    type:{
      type:String,
      require:true
    },
    userId: {
      type: String,
      required: true,
    },
    userImgUrl:{
        type:String,
        require:false
    },
    userMsgData: {
      type: String,
      default: "",
    },
    createdAt: { type: Date, default: Date.now }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReportsMasseges", ReportSchema);
