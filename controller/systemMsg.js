const handleError = require('../utils/errorHandeler')
const SysMassege = require("../models/SystemMasseges");
const User = require("../models/User");
const asyncErrorHandler = require("../wrapper_functions/asyncErrorHandler");
const API = require('../classes/Api');
const addPriveteMsg =asyncErrorHandler(async (req, res,next) => {
  const api = new API(req,res)
    // Destructure request body
    const { userId,type,
      data,
      subTitle,
      title,
      createdAt,
      isPrivate, } = req.body;


    // Find the user by ID
    const user = await User.findById(userId);

    // If the user doesn't exist, return an error
    if (!user) {
      const error = api.errorHandler('not_found')
      next(error)
    }
       // Create a new SysMassege instance
       const newSysMassege = new SysMassege({
        type,
        data,
        subTitle,
        title,
        createdAt,
        isPrivate,
      });
  
      // Save the new SysMassege
      const sysMassege = await newSysMassege.save();
  
    // Create an object for private messages
    const privateMessage = {
      massege: sysMassege._id,
      isOpened: false,
    };

    // Push the private message to the user's privateMessages array
    await user.updateOne({ $push: { privateMessages: privateMessage } });

    // Return the sysMassege as a response
    api.dataHandler('create',sysMassege)
})
const addGlobalMsg =asyncErrorHandler( async (req, res,next) => {
  const api = new API(req,res)
    // Destructure request body
    const {  type,
      data,
      subTitle,
      title,
      createdAt,
      isPrivate, } = req.body;

    // Create a new SysMassege instance
    const newSysMassege = new SysMassege({
      type,
      data,
      subTitle,
      title,
      createdAt,
      isPrivate,
    });

    // Save the new SysMassege
    const sysMassege = await newSysMassege.save();

    // Push the global message to all users
    await User.updateMany(
      {},
      {
        $push: {
          globalMessages: {
            MassegeId: sysMassege._id,
            isOpened: false,
          },
        },
      }
    );
     api.dataHandler('create',sysMassege)
})
module.exports = {
  addGlobalMsg,
  addPriveteMsg
}