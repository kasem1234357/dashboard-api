const CustomError = require("../classes/Error")

 const restrict = (requiredPermissions)=>{
    return (req,res,next)=>{
        console.log(requiredPermissions);
        console.log(req.user.role);
        
        if(!requiredPermissions.includes(req.user.role)){
            const error = new CustomError(`you don't have permissions to perform this action `)
            next(error)
        }
        next()
    }
}
module.exports= restrict