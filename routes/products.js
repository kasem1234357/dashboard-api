const router = require("express").Router();
const { getProducts, postProductImages, createProduct, updateProduct, getProduct, deleteProduct, getProductSales, getProductInfo, getTransactions,testFn} = require("../controller/client");
const { restrict, isAuth } = require("../meddlewares");

// const cloudinaryImageUploadMethod = file => {
//   let url =""
//   cloudinary.uploader.upload(file, { width: 500, crop: 'scale' }, function(error, result) {
//     if (error) {
//       console.error(error);
//     } else {
//       url =result.secure_url;
//     }
//   });
//   return url
// }

router.post("/images", postProductImages);
// const upload = async (req, res, next) => {
//   try {
//     const { profileImg, otherImg, ...others } = req.body;

//     let profileImgUrl = await cloudinaryUpload(profileImg);
//     let otherImgUrls = [];

//     for (let i = 0; i < otherImg.length; i++) {
//       let url = await cloudinaryUpload(otherImg[i].url);
//       otherImgUrls.push({ id: otherImg[i].id, url:url.secure_url });
//     }
//     req.body.profileImg = profileImgUrl.secure_url
//       req.body.otherImg= otherImgUrls

//     next();
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };
// add product
router.post("/", createProduct);
// update product
router.put("/update/:id",isAuth,restrict(['super_admin','admin']), updateProduct);
// get product

//get all products
//====================================================//
/*
router.get('/',async(req,res)=>{
 try {
   const allProducts = await Product.find()
   res.status(200).json(allProducts)
 } catch (error) {
  res.status(500).json(error)
 }
})
*/
//==================================================//
router.get("/", getProducts);
router.get('/transactions',isAuth,restrict(['super_admin','sales_manger']),getTransactions)
router.get('/info/:id',getProductInfo)
//delete products
router.get('/sales/:id',isAuth,restrict(['super_admin','sales_manger']),getProductSales)
router.delete("/:id",isAuth,restrict(['super_admin','admin']),deleteProduct);
router.get("/:id", getProduct);

module.exports = router;
/**
 * {
  asset_id: 'd1d8c760d557109b389cbef4a2f05f71',
  public_id: '202412331544/h33tbvqs47s6p9daticq',        
  version: 1706012176,
  version_id: '346087462b4cc0356c22f3507250ccab',        
  signature: 'dd926fb3fb4158efcaeadd363aa3edfcb85e40f6', 
  width: 640,
  height: 640,
  format: 'jpg',
  resource_type: 'image',
  created_at: '2024-01-23T12:16:16Z',
  tags: [],
  pages: 1,
  bytes: 229969,
  type: 'upload',
  etag: '71f158b81f631d83217dfd6a91c2e183',
  placeholder: false,
  url: 'http://res.cloudinary.com/doda4kgzp/image/upload/v1706012176/202412331544/h33tbvqs47s6p9daticq.jpg',      
  secure_url: 'https://res.cloudinary.com/doda4kgzp/image/upload/v1706012176/202412331544/h33tbvqs47s6p9daticq.jpg',
  folder: '202412331544',
  quality_analysis: { focus: 1 },
  api_key: '729898657389182'
}
 */
//65afb37b0e3e323b093c7f00
//202412333834