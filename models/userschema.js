const mongoose=require('mongoose')
const Product = require('./productschema')
const userschema=mongoose.Schema({
    name:{
        type:String ,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobileNumber:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    access:{
        type:Boolean,
        default:true
    },
    cart: {
        items: [{
          product_id: {
            type: String,
            ref: 'products'
          },
          qty: {
            type: Number
          },
          price:{
            type : Number
          }
        }
        ],
        totalPrice: Number
      }
})

userschema.methods.addCart = function (pro) {
  console.log(pro)
  const price = parseInt(pro.price, 10)
  console.log(typeof(price));
  const prId = pro._id.toString();
    const cart = this.cart
    const isExisting = cart.items.findIndex(objItems => objItems.product_id == prId)
    if (isExisting >= 0) {
      cart.items[isExisting].qty += 1
    } else {
 
      cart.items.push({ product_id: pro._id, qty: 1 ,price:pro.price})

    }
    if (!cart.totalPrice) {
      cart.totalPrice = 0
    }
    cart.totalPrice += price
    return this.save()
  }

  userschema.methods.changeqty = async function (prdId, qty, ctn, callBack) {
  const { cart } = this;
  const quantity = parseInt(qty, 10);
  const count = parseInt(ctn, 10);
  const Prduct = await Product.findById(prdId);
  const price = parseInt(Prduct.price, 10);
  console.log(price,'---');
  const prdid = Prduct._id.toString();
  console.log(prdid);
  const response = {};
  // eslint-disable-next-line no-mixed-operators
  if (quantity === 1 && count === -1 || count == -2) {
    const isExisting = cart.items.findIndex((objitem) => objitem.product_id == prdid);
    console.log(cart.totalPrice,'==');
    cart.totalPrice -= price* qty
    console.log(cart.totalPrice,'=');
    cart.items.splice(isExisting, 1);
    response.remove = true;
  } else if (count === 1) {
    const isExisting = cart.items.findIndex((objitem) => objitem.product_id == prdid);
    console.log(isExisting);
    cart.items[isExisting].qty += 1;
    cart.totalPrice += price;
    response.status = cart.items[isExisting].qty;
  } else if (count === -1) {
    const isExisting = cart.items.findIndex((objitem) => objitem.product_id == prdid);
    cart.items[isExisting].qty -= 1;
    cart.totalPrice -= price;
    response.status = cart.items[isExisting].qty;
  }
  this.save().then((doc) => {
    response.total = doc.cart.totalPrice;
    response.length = cart.items.length;
    callBack(response);
  })
}


userschema.methods.delete = async function (prodId) {
  const ct = this.cart
  const Existing = await ct.findIndex(obj=>obj.id==prodId)
  addr.splice(Existing,1)
  return this.save()
}
module.exports = mongoose.model("user",userschema)