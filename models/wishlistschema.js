const mongoose = require('mongoose')
// const Product = require('./productschema')
const wishlistschema = mongoose.Schema({
    userId : {
        type : String,
        ref : 'user'
    },
    products : [
        {
        product : {
            type : String,
            ref : 'products'
        }
}
]
})

module.exports = mongoose.model("wishlist",wishlistschema)