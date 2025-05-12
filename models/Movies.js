const mongoose = require('mongoose');
const moviesSchema = new mongoose.Schema({
year:{
    type:Number
},
month:{
    type:Number
},
ranges:{
    type:Object,
    default:{
    A_F:{
        type:Object,
        default:{}
    },
    G_L:{
        type:Object,
        default:{}
    },
    M_R:{
        type:Object,
        default:{}
    },
    S_Z:{
        type:Object,
        default:{}
    },
    other:{
        type:Object,
        default:{}
    }}

}



})
module.exports = mongoose.model("movies", moviesSchema);