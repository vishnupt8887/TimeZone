const express = require('express')
const {
    home, 
    Login,
    signup,
    postSignup,
    postLogin,
    logout,
    profile,
    shop,
    cart,
    addCart,
    postOtp,
    qtyChange,
    wishList,
    addWishlist,
    checkOut,
    address,
    editAddress,
    deleteAddress,
    editName,
    order,
    successPage,
    removeCart,
    orderList,
    orderProducts,
    changeStatus,
    couponCheck,
    productDet
} = require('../controllers/userController')

const router = express.Router()
const {verifyUser} = require('../middleware/verifyUser')

router.get('/',home)
router.get('/login',Login)
router.get('/signup',signup)
router.post('/signupSubmit',postSignup)
router.post('/loginSubmit',postLogin)
router.post('/otp',postOtp)
router.get('/logout',verifyUser,logout)
router.get('/profile',verifyUser,profile)
router.post('/address',verifyUser,address)
router.post('/editAddress/:id',verifyUser,editAddress)
router.delete('/deleteAddress',verifyUser,deleteAddress)
router.post('/editName',verifyUser,editName)
router.get('/shop',shop)
router.get('/cart',verifyUser,cart)
router.get('/add-to-cart',verifyUser, addCart)
router.post('/qtyChange',qtyChange)
router.delete('removeCart',verifyUser,removeCart)
router.get('/wishList',verifyUser,wishList)
router.post('/addWishlist',verifyUser,addWishlist)
router.get('/checkOut',verifyUser,checkOut)
router.post('/order',verifyUser,order)
router.get('/orderList',verifyUser,orderList)
router.get('/successPage',verifyUser,successPage)
router.post('/orderProducts',verifyUser,orderProducts)
router.get('/changeStatus', changeStatus)
router.post('/couponCheck',couponCheck)
router.get('/productDet',productDet)
module.exports = router
