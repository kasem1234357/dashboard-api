const { Timestamp } = require("mongodb");
const { default: mongoose } = require("mongoose");
const mongooose = require("mongoose");
const ProductSchema = mongooose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      min: 0,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    barCode: {
      required: false,
      type: String,
    },
    profileImg: {
      type: {
        url:String,
        public_id:String,
      },
      default: {
        url:'',
        public_id:'',
      },
    },
    otherImg: {
      type: [ {
        id:Number,
        url:String,
        public_id:String,
      },],
      default: [],
    },
    coupon: {
      type: String,
    },
    coponPersent: {
      type: Number,
    },
    type: {
      type: String,
      required:false,
    },
    tags: {
      type: Array,
      default: [],
    },
    desc: {
      type: String,
      min: 25,
    },
    colors: {
      type: Array,
      default: [],
    },
    galleryName:{
      type:String,
    }
  },
  { timestamp: true }
);
module.exports = mongoose.model("Product", ProductSchema);
