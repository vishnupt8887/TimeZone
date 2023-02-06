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
    changeStatus
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
router.post('/address',address)
router.post('/editAddress/:id',editAddress)
router.delete('/deleteAddress',deleteAddress)
router.post('/editName',editName)
router.get('/shop',shop)
router.get('/cart',verifyUser,cart)
router.get('/add-to-cart',verifyUser, addCart)
router.post('/qtyChange',qtyChange)
router.delete('removeCart',removeCart)
router.get('/wishList',verifyUser,wishList)
router.post('/addWishlist',addWishlist)
router.get('/checkOut',checkOut)
router.post('/order',order)
router.get('/orderList',orderList)
router.get('/successPage',successPage)
router.post('/orderProducts',orderProducts)
router.get('/changeStatus', changeStatus)

module.exports = router
