const mongoose = require("mongoose");
const TransactionSchema = new mongoose.Schema(
  {
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
    products: {
      type:[
        {
          productID:{
          type:mongoose.Types.ObjectId,
          ref:'products'
        },
           amount:Number,
           priceForSingle:Number,
        }
      ],
      of: Number,
      
    },
    deliveredDate:Date,
    status:{
      type:String,
      enum:['in Progress',"success","failed"]
    },
    totalBudget:Number,
    
  },
  { timestamps: true }
);
TransactionSchema.index({ userId: 1 });
module.exports = mongoose.model("Transaction", TransactionSchema);
