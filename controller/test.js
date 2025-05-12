const API = require("../classes/Api");
const Movies = require("../models/Movies");
const asyncErrorHandler = require("../wrapper_functions/asyncErrorHandler");

const getAllMovies = asyncErrorHandler(async(req,res,next)=>{
    const api = new API(req, res);
    const {year,month,range,name} =api.getQuery().allQuery
    const field =`ranges.${range}`
    console.log(field,year)
    api.modify(Movies.findOne({year,month,field:name})).limitFields()
    const users = await api.query
    const total = await Movies.countDocuments()
        api.dataHandler('fetch',{
          users,
          total,
        })
    })
    module.exports = {getAllMovies}