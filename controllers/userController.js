const user = require('../models/userschema')
const bcrypt = require('bcrypt')
const Product = require('../models/productschema')
const { sendOtp, verifyOtp } = require('./util/otp')
const category = require('../models/categoryschema')
const { findById, find, updateOne, findOne } = require('../models/productschema')
const wish = require('../models/wishlistschema')
const Address = require('../models/addressschema')
const session = require('express-session')
const userHelpers = require('../helpers/userhelper')
const Order = require('../models/orderschema')
const Coupons = require('../models/couponschema')
const { use } = require('../router/user')
const Banner = require('../models/bannerschema')


module.exports = {
    home: async(req, res, next) => {
        try {
            const ban = await Banner.find()
            res.render('user/index', { login: req.session.user ,ban})
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    Login: (req, res, next) => {
        try {
            if (req.session.logedIn) {
                res.redirect('/')
            } else res.render('user/login');
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    signup: (req, res, next) => {
        try {
            if (req.session.signedIn) {
                res.redirect('/')
            } else {
                res.render('user/signup', { error: false })
            }
        }
        catch (error) {
            console.log(error)
            next(error)
        }
    },
    postSignup: async (req, res, next) => {
        try {
            // console.log(req.body)
            const mobileNum = req.body.mobileNumber

            req.session.signup = req.body
            // console.log(req.body)

            const userr = await user.findOne({ email: req.body.email })
            // console.log(userr, 'ivde');
            if (userr) {
                res.redirect('/login')
            } else {
                sendOtp(mobileNum)

                res.render('user/otp', { number: mobileNum })
            }
        } catch (error) {
            console.log(error, 'dfg')
            next(error)
        }
    },
    postOtp: async (req, res, next) => {
        try {
            console.log(req.session.signup)
            let { name, email, mobileNumber, password, confirmPassword } = req.session.signup
            const otp = req.body.otpis
            console.log(otp)

            await verifyOtp(mobileNumber, otp).then(async (verification_check) => {
                if (verification_check.status === 'approved') {
                    password = await bcrypt.hash(password, 10)
                    const uuser = new user({
                        name,
                        email,
                        mobileNumber,
                        password,
                        confirmPassword
                    })
                    console.log(uuser)
                    uuser.save((err, newUser) => {
                        if (err) {
                            console.log(err.message)
                            res.redirect('/signup')
                        } else {
                            console.log(newUser)
                            req.session.user = newUser
                            res.redirect('/')
                        }
                    })
                } else if (verification_check.status === 'pending') {
                    console.log('otp is not match')
                    res.redirect('/signup')
                }
            })
        } catch (error) {
            res.redirect('/signup')
            console.log(error)
            next(error)
        }
    },
    postLogin: async (req, res, next) => {
        try {
            const userEmail = req.body.email
            const userPassword = req.body.password
            let singleUser = false;
            singleUser = await user.findOne({ email: userEmail })

            if (singleUser && singleUser.access) {
                bcrypt.compare(userPassword, singleUser.password).then((status) => {
                    if (status) {
                        req.session.user = singleUser
                        req.session.logedIn = true
                        console.log(req.session.logedIn);
                        res.redirect('/')
                    } else {
                        console.log("Wrong Password")
                        res.redirect('/login')
                    }
                })
            } else {
                res.redirect('/login')
                console.log("No user");
            }
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    profile: async (req, res, next) => {
        try {
            const userr = req.session.user
            const userId = req.session.user._id
            const users = await user.findOne({ _id: userId })
            const add = await Address.findOne({ userId: userId })
            if (req.session.flashMssg) {
                err = req.session.flashMssg
                req.session.flashMssg = null
            }
            res.render('user/profile', { users, add })
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    address: async (req, res, next) => {
        // console.log('jijijiiiiiiiiiiiiiiiiii');
        try {
            const userrId = req.session.user._id
            // console.log(userrId + 'idddddd')
            const add = await Address.findOne({ userId: userrId })
            // console.log(add + 'addddddd')
            if (add) {
                if (add.address.length >= 3) {
                    res.json({ status: false })
                    return
                }
                await Address.updateOne({ userId: userrId }, { $push: { address: req.body } })
                res.status(200).json({ status: true })
            } else {
                req.session.status = true
                const addr = new Address({
                    address: [req.body],
                    userId: userrId
                })
                addr.save((err, doc) => {
                    if (err) console.log()
                    else {
                        // console.log(doc)
                        res.json({ status: true })
                    }
                })
                // console.log(addr + 'addrrrrrr');
            }
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    editAddress: async (req, res, next) => {
        try {
            const addId = req.params.id
            // console.log(addId + 'addIdddddd')
            const userid = req.body.userId
            // console.log(userid + 'useriddddddd')
            const newAdd = {
                name: req.body.name,
                mob: req.body.mob,
                house: req.body.house,
                landmark: req.body.landmark,
                city: req.body.city,
                district: req.body.district,
                state: req.body.state,
                pincode: req.body.pincode
            }
            // console.log(newAdd + 'newAddddd')
            const newDoc = await Address.findOne({ userId: userid })
            // console.log(newDoc + 'newDoccccccc')
            const ad = await newDoc.editAddr(newAdd, addId)

            res.redirect('/profile')

        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    deleteAddress: async (req, res, next) => {
        try {
            const addId = req.query.addId
            // console.log(addId + 'dddiiiiddd');
            const usId = req.query.userId
            const dAdd = await Address.findOne({ userId: usId })
            const del = await dAdd.delete(addId)
            // console.log(del)
            if (del) {
                res.status(200).json({ status: true })
            }
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    editName: async (req, res, next) => {
        try {
            // console.log('Ethy');
            // console.log(req.body, 'hiiiiiiiiiiiii')
            const usId = req.body.userId
            // console.log(usId)

            const newName = await user.updateOne({ _id: usId }, { $set: { name: req.body.name } })
            res.status(200).json({ status: true })
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    logout: (req, res, next) => {
        try {
            req.session.logedIn = false
            req.session.user = null
            res.redirect('/login')
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    shop: async (req, res, next) => {
        try {
            const pro = await Product.find({ access: true })
            res.render('user/shop', { pro })
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    cart: async (req, res, next) => {

        try {
            const id = req.session.user._id
            const useer = await user.findById(id)
            const cartz = await useer.populate('cart.items.product_id')
            // console.log(cartz)
            console.log(cartz.cart.items)

            res.render('user/cart', { cartz, useer })
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    addCart: async (req, res, next) => {
        try {
            const id = req.session.user._id
            const useer = await user.findById(id)
            const proId = req.query.proid
            console.log(proId + 'jiijii')
            Product.findById(proId).then((product) => {
                // console.log(product + 'koi')
                useer.addCart(product).then(() => {
                    res.redirect('/cart')
                }).catch((err) => console.log(err))
            })
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    removeCart: async (req, res, next) => {
        try {
            const prodId = req.query.prodId
            // console.log(prodId + 'rrrrrriiiiddd');
            const usId = req.query.userId
            const dCart = await user.findOne({ _id: usId })
            const del = await dCart.delete(prodId)
            // console.log(del)
            if (del) {
                res.status(200).json({ status: true })
            }
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    qtyChange: async (req, res, next) => {
        try {
            // console.log('ethy');
            const id = req.session.user._id
            const useer = await user.findById(id)
            useer.changeqty(req.body.productId, req.body.qty, req.body.count, (response) => {
                response.access = true;
                req.session.lngth = response.length;
                res.json(response);
            });
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    wishList: async (req, res, next) => {
        try {
            const userid = req.session.user._id
            const wishitems = await wish.findOne({ userId: userid }).populate("products.product")
            // console.log('wishlist:  ', wishitems)
            res.render('user/wishList', { wishitems })
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    addWishlist: async (req, res, next) => {
        try {
            const pro = req.query.pro;
            const userId = req.session.user._id

            const user = await wish.findOne({ user: userId })
            if (user) {
                const index = await user.products.findIndex((obj) => obj.product == pro)
                if (index >= 0) {
                    user.products.splice(index, 1)
                    await user.save()
                    res.json({ remove: true })
                } else {
                    const pros = { product: pro }
                    user.products.push(pros)
                    await user.save()
                    res.json({ added: true })
                }
            } else {
                const wl = new wish({
                    userId: userId,
                    products: [
                        {
                            product: pro,
                        },
                    ],
                });
                await wl.save()
                res.json({ added: true })
            }
            // .then((doc) => {
            //     console.log(doc);
            //     res.json({ added: true });
            // })
            // .catch((err) => {
            //     console.log(err);
            // });
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    checkOut: async (req, res, next) => {
        console.log('ind.........')
        try {
            const useId = req.query.userId
            console.log(useId,'uiiiiii')
            const coupons = await Coupons.find()
            // console.log(useId,'id');
            const usr = await user.findOne({ _id: useId }).populate('cart.items.product_id')
            const addd = await Address.findOne({ useId })

            res.render('user/checkOut', { useId, usr, addd,coupons })
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    couponCheck : async(req,res)=>{
        try {
            const total = parseInt(req.body.total)
            const coupon = await Coupons.findOne({code:req.body.code})
            if (coupon && coupon.minCartAmount <= total) {
                const amount = coupon.amount
                const cartTotal = total - amount
                res.json({status:true, total: cartTotal })
            } else {
              console.log('false')
              res.json({status:false, message: 'No such coupon' })
            }
        } catch (error) {
            console.log(error)
        }
    },
    order: async (req, res, next) => {
        try {
            if (req.session.user) {
                const userId = req.session.user._id
                const Couponcode = req.body.code
                let total = req.body.total
                total = parseInt(total)
                console.log(req.body,'hiihihihi')
                if (Couponcode !== '') {
                    const coupons = await Coupons.findOne({ code: Couponcode })
                    if (!coupons) {
                      return next(new Error('No coupon founded in this Id', 404))
                    }
                    const index = await coupons.userUsed.findIndex(obj => obj.userId == userId)
                    if (index >= 0) {
                      console.log('user exist')
                      res.json({ couponUsed:true })
                     return
                    } else {
                      const userz = { userId: '' }
                      userz.userId = userId
                      await Coupons.findOneAndUpdate({ code: Couponcode }, { $addToSet: { userUsed: userz } })
                      const useer = await user.findOne({ _id: userId })
                      if (!useer) {
                        return next(new Error('User not found', 404))
                      }
                      useer.cart.totalPrice = total
                      await useer.save()
                    }
                  }
                const products = await userHelpers.getCartProductList(req.body.Id)
                await userHelpers.placeOrder(req.body, products)
                res.json({ status: true })
            } else {
                throw new Error("not logged in", 404)
            }
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    successPage: (req, res, next) => {
        try {
            res.render('user/successpage')
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    orderList: async (req, res, next) => {
        try {
            const userid = req.session.user
            // console.log(userid)
            const orders = await Order.find({ user_Id: userid }).sort({ _id: -1 })
            // console.log(orders)
            const aadId = orders.map((x) => {
                return x.address
            })
            // console.log(aadId)
            const aad = await Address.findOne({ userId: userid })
            const addres = await aad.finding(aadId)
            // console.log(addres)
            res.render('user/orderList', { orders, addres })
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    orderProducts: async (req, res, next) => {
        try {
            const orderId = req.body.orderId
            // console.log(orderId, 'dddd')
            const orderDetials = await Order.findOne({ _id: orderId }).populate('cart.items.product_id')
            // console.log(orderDetials, 'dddtttt')
            res.json(orderDetials)
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    changeStatus: async (req, res, next) => {
        try {
            const status = req.query.s
            const orderId = req.query.id

            const ord = await Order.findOneAndUpdate({ _id: orderId }, { $set: { orderStatus: status } }, { new: true })
            if (ord.orderStatus === 'cancelled') {
                const products = ord.cart.items.map((el) => {
                    const product = { productId: el.product_id, qty: el.qty }
                    return product
                })
                for (let i = 0; i < products.length; i++) {
                    await Product.findOneAndUpdate({ _id: products[i].productId }, { $inc: { stock: products[i].qty } })
                }
            }
            res.json({ status: true })

        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    productDet : async(req,res,next)=>{
        try {
            proId = req.query.proid
            prod = await Product.findOne({_id:proId}).populate('category.categoryName')
            // console.log(prod,'kitttttyyyy')
            res.render('user/productDet',{prod})
        } catch (error) {
            console.log(error)
            // throw new Error('ERFASFSDAFASDF')
            next(error)
        }
    }
}
