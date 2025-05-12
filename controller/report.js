const {REPORT_STATES} = require('../constraints/CONSTANTS')
const handleError = require('../utils/errorHandeler')
const Reports = require("../models/Reports");
const User = require("../models/User");
const asyncErrorHandler = require("../wrapper_functions/asyncErrorHandler");
const API = require('../classes/Api');
 const addReport =asyncErrorHandler(async (req, res,next) => {
    // Destructure request body
    const { userId, ...reportData } = req.body;
   const api = new API(req,res)
    // Create a new Reports instance
   

    // Find the user by ID
    const user = await User.findById(userId);

    // If the user doesn't exist, return an error
    if (!user) {
      const error = api.errorHandler('not_found')
      next(error)
    }
    const newReport = new Reports(req.body);

    // Save the new report
    const report = await newReport.save();
    // Create an object for report messages with initial state
    const reportMessage = {
      massege: report._id,
      state: REPORT_STATES.NOT_READ,
    };

    // Push the report message to the user's reportMessages array
    await user.updateOne({ $push: { reportMessages: reportMessage } });

    // Return the report as a response
    api.dataHandler('create',report)

})
const getReports = asyncErrorHandler(async(req,res,next)=>{
  const api = new API(req,res)
     const reports = await Reports.find()
     api.dataHandler('fetch',reports)
})
module.exports = {
  addReport,
  getReports
}
