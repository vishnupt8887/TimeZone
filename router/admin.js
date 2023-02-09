const express = require('express')
const router = express.Router()
// const { storeimage } = require('../middleware/multer')
const { verifyAdmin } = require('../middleware/verifyadmin')
// const { verifyAdmin } = require('../middleware')
const {storeimage} = require('../middleware/multer')
const {
    home,
    adminLogin,
    adminPost,
    logout,
    userList,
    block,
    unBlock,
    addCategory,
    category,
    addCategoryPost,
    categoryDisable,
    categoryEnable,
    productList,
    addProduct,
    addProductPost,
    listProduct,
    unlistProduct,
    editProducts,
    editProPost,
    order,
    changeStatus,
    orderProducts,
    bannerAdd,
    PostBannerAdd,
    banner,
    deleteBanner,
    deleteCoupon,
    coupons,
    postAddCoupons,
    addCoupons,
    salesReport,
    monthlySalesReport,
    yearlySalesReport,
    chart1,
    sales,
    // error
    // adminProfile
} = require('../controllers/adminController')

router.get('/',verifyAdmin, home)
router.get('/logout',logout)
router.get('/adminLogin',adminLogin)
router.post('/adminPost',adminPost)
router.get('/users',verifyAdmin,userList)
router.get('/block/:Id',verifyAdmin,block)
router.get('/unBlock/:Id',verifyAdmin,unBlock)
router.get('/category',verifyAdmin,category)
router.get('/addCategory',verifyAdmin,addCategory)
router.post('/addCategoryPost',verifyAdmin,storeimage,addCategoryPost)
router.get('/categoryDisable/:Id',verifyAdmin,categoryDisable)
router.get('/categoryEnable/:Id',verifyAdmin,categoryEnable)
router.get('/productList',verifyAdmin,productList)
router.get('/addProduct',verifyAdmin,addProduct)
router.post('/addProductPost',verifyAdmin,storeimage,addProductPost)
router.get('/listProduct/:Id',verifyAdmin,listProduct)
router.get('/unlistProduct/:Id',verifyAdmin,unlistProduct)
router.get('/editProducts/:Id',verifyAdmin,editProducts)
router.post('/editProPost/:Id',storeimage,editProPost)
router.get('/order',verifyAdmin,order)
router.get('/changeStatus',verifyAdmin,changeStatus)
router.post('/orderProducts',verifyAdmin,orderProducts)
router.get('/add-banner',verifyAdmin,bannerAdd)
router.post('/add-banner',verifyAdmin,storeimage, PostBannerAdd)
router.get('/banner',verifyAdmin, banner)
router.get('/delete-banner',verifyAdmin, deleteBanner)
router.get('/addCoupons', verifyAdmin, addCoupons)
router.post('/addCoupon', verifyAdmin, postAddCoupons)
router.get('/coupons',verifyAdmin, coupons)
router.get('/couponDelete',verifyAdmin, deleteCoupon)
router.post('/salesReport',verifyAdmin,salesReport)
router.get('/sales',sales)
router.get('/monthlySalesReport',verifyAdmin,monthlySalesReport)
router.get('/yearlySalesReport',verifyAdmin,yearlySalesReport)
router.get('/chart1',verifyAdmin, chart1)
// router.get('/profile',adminProfile)
// router.get('*', function(req,res){
//     res.redirect('/admin/adminLogin')
// })

module.exports = router