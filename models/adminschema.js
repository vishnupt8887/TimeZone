const mongoose=require('mongoose')
const adminschema=mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model("admin",adminschema)