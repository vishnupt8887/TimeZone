const mongoose = require('mongoose')
const categoryschema = mongoose.Schema({
    categoryName : {
        type : String,
        required : true,
        uppercase:true,
        unique:true
    },
    image : {
        type : String,
        required : true
    },
    discription : {
        type : String,
        maxlength : 100,
        required : true
    },
    access : {
        type : Boolean,
        default:true
    }
},{timestamps : true})

module.exports = mongoose.model("category",categoryschema) 