const { dataOverallStat } = require("../../client/src/components/Data/dt");
const API = require("../classes/Api");
const OverallStat = require("../models/OverallStat"); // Assuming the schema file is named models/OverallStat.js
const asyncErrorHandler = require("../wrapper_functions/asyncErrorHandler");

const getOverallStats =asyncErrorHandler(async(req,res,next)=> {
  const api = new API(req,res)
 const stats = await OverallStat.aggregate([
      {
        $match: { year: 2021 }
      },
      {
        $project: {
          _id: 0,
          totalCustomers: 1,
          yearlySalesTotal: 1,
          yearlyTotalSoldUnits: 1,
          yearlyTotalLikes:1,
          yearlyTotalSubscribing:1,
          year: 1,
          monthlyData: 1,
          dailyData: 1,
          salesByCategory: {
            $map: {
              input: { $objectToArray: "$salesByCategory" },
              as: "category",
              in: { category: "$$category.k", totalSales: "$$category.v" }
            }
          }
        }
      }
    ]);

    api.dataHandler('fetch',stats)

  
  
})
const createOverallStat = asyncErrorHandler(async (req, res,next) => {
  const api = new API(req,res)
  const newOverallStat = new OverallStat(dataOverallStat);
  
    const savedOverallStat = await newOverallStat.save();
    console.log(savedOverallStat);
    api.dataHandler('create',null)

})
const updateOverallStat = asyncErrorHandler(async (req, res,next) => {
  console.log('update operation')
    const api = new API(req,res)
    
    const overallStat = await OverallStat.findById(req.params.id);
    await overallStat.updateOne({ $set: req.body });
   api.dataHandler('update')
})
const deleteOverallStat = asyncErrorHandler(async (req, res,next) => {
    const api = new API(req,res)
    const {images}= req.body
    const test =await cloudinaryDelete(images)
    const overallStat = await OverallStat.findById(req.params.id);
    await overallStat.deleteOne();
    api.dataHandler('delete')
})
module.exports={getOverallStats,  createOverallStat, updateOverallStat,deleteOverallStat}
// Usage
// getOverallStats(2021)
//   .then((stats) => {
//     console.log(JSON.stringify(stats, null, 2));
//   })
//   .catch((error) => {
//     console.error(error);
//   });
