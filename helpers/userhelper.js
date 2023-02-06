
// const { response } = require('express')
const order = require('../models/orderschema')
const products = require('../models/productschema')
const user = require('../models/userschema')



module.exports = {
    placeOrder : (orderr,prod)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(orderr,'ooooooo',prod,'prooooooooo')
            const status = orderr['payment-method']==='COD'?'placed':'pending'
            const nOrder ={
                user_Id : orderr.Id,
                address : orderr.address,
                cart : prod,
  paymentMethod: orderr['payment-method'],
                orderStatus : status,
                date : Date.now() 
            }
            console.log(nOrder, 'nnnnordddddd')
           const ord = new order(nOrder)
           await ord.save()
           const uId = await user.findOne({_id:orderr.Id})
           uId.cart.items = []
           uId.cart.totalPrice = null
           await uId.save()
           resolve()
           console.log(ord, 'orddddddd')
        })
    },
    getCartProductList : (userId)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(userId+'idddddddd')
            const cartt = await user.findOne({_id:userId})
            console.log(cartt.cart.items[0].product_id+'crttttt')
            resolve(cartt.cart)
        })
    }
}