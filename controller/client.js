const ProductStat = require("../models/ProductStat");
const Transaction = require("../models/Transaction");
const Product = require("../models/Product");
const cloudinaryUpload = require("../utils/cloudinaryUpload");
const cloudinaryDelete = require("../utils/cloudinaryDelete");
const asyncErrorHandler = require("../wrapper_functions/asyncErrorHandler");
const API = require("../classes/Api");
// const getProducts = asyncErrorHandler(async (req, res,next) => {
//      const api = new API(req,res)
//     // sort should look like this: { "field": "userId", "sort": "desc"}
//     const { page = 0, pageSize = 20, sort = null, search = "" } = req.query;

//     // formatted sort should look like { userId: -1 }
//     const generateSort = () => {
//       const sortParsed = JSON.parse(sort);
//       const sortFormatted = {
//         [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
//       };

//       return sortFormatted;
//     };
//     const sortFormatted = Boolean(sort) ? generateSort() : {};
//     const products = await Product.find({
//       $or: [
//         { cost: { $regex: new RegExp(search, "i") } },
//         { userId: { $regex: new RegExp(search, "i") } },
//       ],
//     })
//       .sort(sortFormatted)
//       .skip(page * pageSize)
//       .limit(pageSize);
//     const productsWithStats = await Promise.all(
//       products.map(async (product) => {
//         const stat = await ProductStat.find({
//           productId: product._id,
//         });
//         return {
//           ...product._doc,
//           stat,
//         };
//       })
//     );
//     const total = await Product.countDocuments({
//       name: { $regex: search, $options: "i" },
//     });
//    api.dataHandler('fetch',{ productsWithStats, total })
// })
const testFn =asyncErrorHandler(async (req, res,next) =>{
  const api = new API(req,res)
  api.dataHandler('fetch',api.req.body)
})
const getProducts = asyncErrorHandler(async (req, res,next) => {
  const api = new API(req,res)
api.modify(Product.find()).filter(['title']).sort().limitFields().paginate()
 const products = await api.query
 const productsWithStats = await Promise.all(
   products.map(async (product) => {
     const stat = await ProductStat.find({
       productId: product._id,
     });
     return {
       ...product._doc,
       stat,
     };
   })
 );
 const total = await Product.countDocuments()
api.dataHandler('fetch',{ productsWithStats, total })
})
const getTransactions =  asyncErrorHandler(async (req, res,next) => {
  const api = new API(req,res)
  api.modify(Transaction.find()).filter().sort().limitFields().paginate()
  const transactions = await api.query
    const total = await Transaction.countDocuments();
    api.dataHandler('fetch',{
      transactions,
      total,
    })
})
const getProduct =  asyncErrorHandler(async (req, res,next) => {
  const api = new API(req,res)
    // sort should look like this: { "field": "userId", "sort": "desc"}
    const product = await Product.findById(req.params.id);;
    const stat = await ProductStat.find({
      productId: product._id,
    });
    const productsWithStats = {
      ...product._doc,
      stat,
    };
    api.dataHandler('fetch',{ productsWithStats }) 
})
const getProductInfo =  asyncErrorHandler(async (req, res,next) => {
  const api = new API(req,res)
    const product = await Product.findById(req.params.id);
    api.dataHandler('fetch',{ product })
})
const getProductSales = asyncErrorHandler(async (req, res,next) =>{
  const api = new API(req,res)
    // sort should look like this: { "field": "userId", "sort": "desc"}

    const stat = await ProductStat.find({
      productId: req.params.id,
    });
    const productsStats = {
      stat,
    };
    api.dataHandler('fetch',{ productsStats })
} )
const postProductImages =  asyncErrorHandler(async (req, res,next) => {
  console.log(req.body)
  const { imgData, type, index ,galleryName} = req.body;
  const api = new API(req,res)
    let imgUrl = await cloudinaryUpload(imgData,galleryName);
    api.dataHandler('upload',{
      type,
      index,
      url: imgUrl.secure_url,
      public_id:imgUrl.public_id,
      galleryName:galleryName
    })
})
const createProduct =  asyncErrorHandler(async (req, res,next) => {
  const api = new API(req,res)
  const newProduct = new Product(req.body);
  
    const savedProduct = await newProduct.save();
    console.log(savedProduct);
    api.dataHandler('create',null)

})
const updateProduct =  asyncErrorHandler(async (req, res,next) => {
  console.log('update operation')
    const api = new API(req,res)
    
    const product = await Product.findById(req.params.id);
    console.log(req.body);
    
    await product.updateOne({ $set: req.body });
   api.dataHandler('update')
})
const deleteProduct =  asyncErrorHandler(async (req, res,next) => {
    const api = new API(req,res)
    const {images}= req.body
    const test =await cloudinaryDelete(images)
    const product = await Product.findById(req.params.id);
    await product.deleteOne();
    api.dataHandler('delete')
})
module.exports = { getProducts, getTransactions,getProduct,getProductInfo,getProductSales,postProductImages,createProduct, updateProduct,deleteProduct ,testFn};
