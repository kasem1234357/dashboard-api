const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUNDERY_API_KEY,
  api_secret: process.env.CLOUNDERY_API_SECRET,
});


const cloudinaryDelete = async (images,next)=>{
 
  
    return cloudinary.api.delete_resources(images,{ type: 'upload', resource_type: 'image' },function (error, result) {
      if (error) {
        console.log('line 16');
        
        console.log(error);
        
        next()
        
      } else {
        console.log(result);
        return result;
      }
    })
  }
  module.exports = cloudinaryDelete