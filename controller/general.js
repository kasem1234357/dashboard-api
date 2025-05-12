import API from "../classes/Api";
import OverallStat from "../models/OverallStat";
import Transaction from "../models/Transaction";
const asyncErrorHandler = require("../wrapper_functions/asyncErrorHandler");
export const getDashboardStats =asyncErrorHandler(async (req, res) => {
  const {currentDay="2021-11-15",currentMonth="November",currentYear=2021} = req.body
  const api = new API(req,res)
      // hardcoded values
      // const currentMonth = "November";
      // const currentYear = 2021;
      // const currentDay = "2021-11-15";
  
      /* Recent Transactions */
      const transactions = await Transaction.find({ createdOn: { $gte: new Date(currentDay), $lt: new Date(currentDay).setDate(currentDay.getDate() + 1) } })
        .limit(50)
        .sort({ createdOn: -1 });
  
      /* Overall Stats */
      const overallStat = await OverallStat.find({ year: currentYear });
  
      const {
        totalCustomers,
        yearlyTotalSoldUnits,
        yearlySalesTotal,
        monthlyData,
        salesByCategory,
      } = overallStat[0];
  
      const thisMonthStats = overallStat[0].monthlyData.find(({ month }) => {
        return month === currentMonth;
      });
  
      const todayStats = overallStat[0].dailyData.find(({ date }) => {
        return date === currentDay;
      });
      api.dataHandler('fetch',{
        totalCustomers,
        yearlyTotalSoldUnits,
        yearlySalesTotal,
        monthlyData,
        salesByCategory,
        thisMonthStats,
        todayStats,
        transactions,
      })
  })
module.exports = {getDashboardStats}