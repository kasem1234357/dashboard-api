const { getTask, getAllTasks, createTask, deleteTask, updateTask, getTasksWithReminder } = require("../controller/Tasks");
const { isAuth } = require("../meddlewares");

const router = require("express").Router();


// get all tasks
router.get('/',isAuth,getAllTasks )
// get single tasks 
router.get('/:id',getTask)

// add task
router.post('/',createTask )

// delete task 
router.delete('/:id',deleteTask)
// update tasks 
router.put('/update/:id',updateTask)
//
router.get('/calendar/tasks',getTasksWithReminder)






module.exports =router