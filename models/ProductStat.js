const mongoose = require("mongoose");
const MonthlyDataSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: true,
      enum: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ],
    },
    totalSales: {
      type: Number,
      required: true,
      min: 0,
    },
    totalUnits: {
      type: Number,
      required: true,
      min: 0,
    },
    totalLikes: {
        type: Number,
        required: true,
        min: 0,
      },
  },
  { _id: false }
);
const DailyDataSchema = mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  totalSales: {
    type: Number,
    required: true,
    min: 0,
  },
  totalUnits: {
    type: Number,
    required: true,
    min: 0,
  },
  totalLikes: {
      type: Number,
      required: true,
      min: 0,
    },

},
{ _id: false }
)
const ProductStatSchema = new mongoose.Schema(
  {
    yearlySalesTotal: {
      type: Number,
      required: true,
      min: 0,
    },
    yearlyTotalSoldUnits: {
      type: Number,
      required: true,
      min: 0,
    },
    yearlyTotalLikes: {
      type: Number,
      required: true,
      min: 0,
    },
    year: {
      type: Number,
      required: true,
      min: 1900,  // Assuming historical data might be included
      max: new Date().getFullYear(),
    },
    monthlyData: {
      type: [MonthlyDataSchema],
      validate: v => Array.isArray(v) && v.length <= 12,
    },
    dailyData: {
      type: [DailyDataSchema],
      validate: v => Array.isArray(v) && v.length <= 366, // Accounting for leap years
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductStat", ProductStatSchema);