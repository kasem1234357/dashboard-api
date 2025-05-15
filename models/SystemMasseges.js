const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "senderModel",
  },
  senderModel: { type: String, required: true, enum: ["DashUser"] },
  audience: {
    type: String,
    required: true,
    enum: ["ALL_USERS", "ALL_EMPLOYEES", "PRIVATE"],
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId ,
    refPath: "receiverModel",
   
    default: null,
  },
  receiverModel: { type: String, enum: ["DashUser",null], default: null, },
  parentMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
  title:{type: String, required: true, trim: true},
  content: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});
messageSchema.index({ audience: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, createdAt: -1 });
module.exports = mongoose.model("Message", messageSchema);
