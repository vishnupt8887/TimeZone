const mongoose = require('mongoose')


const productschema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    brand : {
        type : String,
        required : true
    },
    price : {
        type : String,
        required : true
    },
    stock : {
        type : Number
    },
    category : {
        type : String,
        ref : 'category',
        required : [true,'one category needed']
    },
    image : {
        type : Array,
        required : true
    },
    discription : {
        type : String,
        max : 100
    },
    discount : {
        type :  String
    }, 
    access : {
        type : Boolean,
        default:true
    }
})

module.exports = mongoose.model('products',productschema)