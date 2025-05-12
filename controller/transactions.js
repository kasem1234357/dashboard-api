const API = require("../classes/Api");
const Transaction = require("../models/Transaction");
const asyncErrorHandler = require("../wrapper_functions/asyncErrorHandler");

const getTransactions = asyncErrorHandler(async (req, res) => {
  const api = new API(req, res);
  const filteringQuery =  api.modify().getQuery().filteringQuery;
const buildSearchConditions = (searchTerm) => {
  const conditions = [];
    
    
  if (searchTerm.username) {
    conditions.push(
      { username: { $regex: searchTerm?.username, $options: 'i' } },
     
    );
   if(searchTerm.totalBudget){

     conditions.push(
       { 
        $expr: {
          $eq: [
            { $toString: "$totalBudget" }, 
            searchTerm
          ]
        }
      }
     )

   }
   if(searchTerm.deliveredDate){
     const searchDate = new Date(searchTerm.deliveredDate);
     conditions.push(
       { deliveredDate: searchDate },
     )

   }
   if(searchTerm.createdAt){
      const searchDate = new Date(searchTerm.createdAt);
      conditions.push(
         { createdAt: searchDate },
      )

   }
    // Date search if valid date

  }

  return conditions.length > 0 ? { $or: conditions } : {};
};
 const aggregation =  [
    { $sort: { createdAt: -1 } },
    { $limit: 50 },
    {
      $lookup: {
        from: 'dashusers',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $project: {
        userId: 1,
        username: { $arrayElemAt: ['$user.username', 0] },
        userImg: { $arrayElemAt: ['$user.profileImg', 0] },
        products: 1,
        deliveredDate: 1,
        status: 1,
        totalBudget: 1,
        createdAt: 1,
        updatedAt: 1
      }
    },
    
  ]
  if(Object.keys(filteringQuery).length!==0){
    aggregation.push({$match:buildSearchConditions(JSON.parse(filteringQuery))})
  }
  const transactions = await Transaction.aggregate(
   aggregation
);
  console.log(aggregation);
  
  api.dataHandler('fetch', transactions);
});



const getTransaction = asyncErrorHandler(async (req, res) => {
  const api = new API(req,res)
  const transaction = await Transaction.findById(req.params.id);
  api.dataHandler("fetch", transaction);
});

const postTransaction = asyncErrorHandler(async (req, res) => {
  const api = new API(req,res)
  const transaction = new Transaction(req.body);
  const savedTransaction = await transaction.save();
  api.dataHandler("create", savedTransaction);
});

const updateTransaction = asyncErrorHandler(async (req, res) => {
  const api = new API(req,res)
  const transaction = await Transaction.findById(req.params.id);
  await transaction.updateOne({ $set: req.body });
  api.dataHandler("update");
});

const deleteTransaction = asyncErrorHandler(async (req, res) => {
  const api = new API(req,res)
  const transaction = await Transaction.findById(req.params.id);
  await transaction.deleteOne();
  api.dataHandler("delete");
});

module.exports = {
  getTransactions,
  getTransaction,
  postTransaction,
  updateTransaction,
  deleteTransaction,
};