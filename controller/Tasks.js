const API = require('../classes/Api');
const Tasks = require('../models/Tasks');
const asyncErrorHandler = require('../wrapper_functions/asyncErrorHandler');
const getAllTasks =asyncErrorHandler(async(req,res,next)=>{
        const api = new API(req,res)
        console.log(req.cookies)
        const allTasks = await Tasks.find()
        api.dataHandler('fetch',allTasks)

   })
const getTask = asyncErrorHandler(async(req,res,next)=>{
  const api = new API(req,res)
        const task = await Tasks.findById(req.params.id)
        api.dataHandler('fetch',task)
   })
const updateTask = asyncErrorHandler(async(req,res,next)=>{
      const api = new API(req,res)
      const task = await Tasks.findById(req.params.id)
      await task.updateOne({$set:req.body})
      api.dataHandler('update')   
   })
const createTask = asyncErrorHandler(async(req,res,next)=>{
  const api = new API(req,res)
    const newTask = new Tasks(req.body)
     const savedTask = await newTask.save()
     api.dataHandler('create',savedTask)
   })
const deleteTask = asyncErrorHandler(async(req,res,next)=>{
    const api = new API(req,res)
     await Tasks.findByIdAndDelete(req.params.id)
      api.dataHandler('delete')
 })
const getTasksWithReminder = asyncErrorHandler(async(req,res,next)=>{
  const api = new API(req,res)
      const tasks = await Tasks.find({remainder:true})
      api.dataHandler('fetch',tasks)

  })
module.exports = {
    getAllTasks,getTask,updateTask,deleteTask,getTasksWithReminder,createTask
}