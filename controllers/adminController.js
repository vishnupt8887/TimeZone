const { render } = require("ejs")
const user = require('../models/userschema')
const category = require('../models/categoryschema')
const products = require('../models/productschema')
const Address = require('../models/addressschema')
const Order = require('../models/orderschema')
const Banner = require('../models/bannerschema')
const Coupon = require('../models/couponschema')

const adminEmail = process.env.AdminEmail
const adminPassword = process.env.AdminPassword

module.exports = {
    home : (req,res,next)=>{
        try {
            res.render('admin/index')
        } catch (error) {
            console.log(error)
            error.admin=true
            next(error)
        }
    },
    adminLogin : (req,res,next)=>{
        try {
        if(req.session.admin){
            res.redirect('/admin')
        }else{
            const error = req.session.adminLogErr

            res.render('admin/login')
            req.session.adminLogErr = null
        }
    } catch (error) {
        console.log(error) 
        error.admin=true
            next(error)  
    }
    },
    adminPost : (req,res,next)=>{
        try {
        console.log(req.body)
        const admin = req.body.email
        const Password = req.body.password
        console.log(admin)
        console.log(adminEmail)
        console.log(Password)
        console.log(adminPassword)

        if(admin == adminEmail && Password == adminPassword){
            // console.log('hiii');
            req.session.admin = true
            res.redirect('/admin')
        }else{
            req.session.adminLogErr = true
            res.redirect('/admin/adminLogin')
        }
    } catch (error) {
          console.log(error)
          error.admin=true
            next(error)  
    }
    },
    userList :async(req,res,next)=>{
        try {
        const userlt = await user.find().sort({_id:-1})
        console.log(userlt)
        res.render('admin/users',{userlt})
    } catch (error) {
            console.log(error)
            error.admin=true
            next(error)
    }
    },
    logout:(req,res,next)=>{
        try {
        req.session.admin = false
        res.redirect('/admin/adminLogin')
    } catch (error) {
            console.log(error)
            error.admin=true
            next(error)
    }
    },
    block : async(req,res,next)=>{
        try{
           const Id = req.params.Id
           console.log(Id);
           await user.findOneAndUpdate({_id:Id},{$set:{access:false}})
           res.redirect('/admin/users')
        }catch(error){
            console.log(error)
            error.admin=true
            next(error)
        }
    },
    unBlock : async(req,res,next)=>{
        try{
           const Id = req.params.Id
           await user.findOneAndUpdate({_id:Id},{$set:{access:true}})
           res.redirect('/admin/users')
        }catch(error){
            console.log(error)
            error.admin=true
            next(error)
        }
    },
    
    addCategory : (req,res,next)=>{
        try {
            res.render('admin/addCategory')
        } catch (error) {
            console.log(error)
            error.admin=true
            next(error)
        }
    },
    category : async(req,res,next)=>{
        try {
            const categoryLt = await category.find()
            console.log(categoryLt)
            let err ;
            if(req.session.flashMssg){
                err = req.session.flashMssg;
                req.session.flashMssg = null
            }
            res.render('admin/category',{categoryLt,err})
        } catch (error) {
            console.log(error)
            error.admin=true
            next(error)
        }
    },
    addCategoryPost : async(req,res,next)=>{
        try {
                const image = req.files   
                let imageUrl = image[0].path
                console.log(imageUrl)
                imageUrl = imageUrl.substring(6)
          
                console.log(imageUrl)
                console.log(req.body.categoryName)
                console.log(req.body.discription)
                const newCategory = new category({
                    categoryName: req.body.categoryName,
                  image: imageUrl,
                  discription: req.body.discription
                })
                 newCategory.save((err,doc)=>{
                    if(err){
                        console.log(err)
                        req.session.flashMssg = 'Category already exists'
                        res.redirect('/admin/category')
                    }else{
                        console.log(newOne)
                        res.redirect('/admin/category')
                    }
                 })
        } catch (error) {
            res.redirect('/admin/category')
            console.log(error)
            error.admin=true
            next(error)
        }
    },
    categoryDisable : async(req,res,next)=>{
        try {
            const Id = req.params.Id
            await category.findOneAndUpdate({_id:Id},{$set:{access:false}})
            res.redirect('/admin/category')
        } catch (error) {
            console.log(error)
            error.admin=true
            next(error)
        }
    },
    categoryEnable : async(req,res,next)=>{
        try {
            console.log('category----------------------------------------')
            const Id = req.params.Id
            await category.findOneAndUpdate({_id:Id},{$set:{access:true}})
            res.redirect('/admin/category')
        } catch (error) {
            console.log(error)
            error.admin=true
            next(error)
        }
    },
    productList : async(req,res,next)=>{
        try {
            const productLt = await products.find().populate('category').sort({_id:-1})
            // console.log('kkkkkkkkkkkkkk');
            // console.log(productLt[0].category);
            // console.log(productLt)
            res.render('admin/productList',{productLt})
        } catch (error) {
            console.log(error)
            error.admin=true
            next(error)
        }
    },
    addProduct : async(req,res,next)=>{
        try {
            const categories = await category.find()
            console.log(categories[1].access)
            res.render('admin/addProduct',{categories})
        } catch (error) {
            console.log(error)
            error.admin=true
            next(error)
        }
    },
    addProductPost : (req,res,next)=>{
        try {
            // console.log(req.body)
            const image = req.files
            const img =[]
            image.forEach((el,i,arr)=>{
                img.push(arr[i].path.substring(6))
            })
            const product = new products({
                name : req.body.name,
                brand : req.body.brand,
                price : req.body.price,
                stock : req.body.stock,
                category : req.body.category.trim(),
                image : img,
                discription : req.body.discription,
                discount : req.body.discount
            })
            product.save((error,doc)=>{
                if(error){
                    console.log(error+'vichu');
                    res.redirect('/admin/addProduct')
                }else{

                    console.log(doc+'herer');
                    res.redirect('/admin/productList')
                }
            })
        } catch (error) {
            console.log(error)
            error.admin=true
            next(error)
        }
    },
    listProduct : async(req,res,next)=>{
        try {
            const Id = req.params.Id
            await products.findByIdAndUpdate({_id:Id},{$set : {access:true}})
            res.redirect('/admin/productList')
        } catch (error) {
            console.log(error)
            error.admin=true
            next(error)
        }
    },
    unlistProduct : async(req,res,next)=>{
        try {
            const Id = req.params.Id
            await products.findByIdAndUpdate({_id:Id},{$set : {access:false}})
            res.redirect('/admin/productList')
        } catch (error) {
            console.log(error)
            error.admin=true
            next(error)
        }
    },
    editProducts : async(req,res,next)=>{
        try {
            const Id = req.params.Id
            const cat = await category.find()
            const pro = await products.findOne({_id:Id}).populate('category')
            console.log(pro)
            console.log(Id);
            res.render('admin/editProducts',{cat,pro,Id})
        } catch (error) {
            console.log(error)
            error.admin=true
            next(error)
        }
    },
    editProPost : async (req,res,next)=>{
        try {
            console.log(req.body)
            const Id = req.params.Id
            const image = req.files
            console.log(image)
            const img =[]
            if(image.length>0){
                image.forEach((el,i,arr)=>{
                    img.push(arr[i].path.substring(6))
                })
                console.log(img)
                 await    products.updateOne({_id:Id},{$set:{image:img}})
            }
        const product = await products.updateOne({_id:Id},{$set:{
                name: req.body.name,
                brand: req.body.brand,
                price: req.body.price,
                stock: req.body.stock,
                category: req.body.category,
                discription: req.body.discription,
                discount: req.body.discount
            }})
            if (product) {
                console.log(product,'product')
                res.redirect('/admin/productList')
            } else {
                throw new Error('product editing failed',404)
            } 
        } catch (error) {
            console.log(error)
            error.admin=true
            next(error)
        }
            
    },
    order : async(req,res,next)=>{
        try {
            const ret = []
            const addList = await Address.find()
            console.log(addList,'Lttttttttt')
            const ord = await Order.find().populate('user_Id').sort({_id:-1})
            console.log(ord,'oddddddd')
            ord.forEach((el,i)=>{
                addList.forEach((x)=>{
                    const index = x.address.findIndex(obj => obj._id == el.address.trim())
                    console.log(index,'inddddd')
                    if (index >= 0) {
                        ret.push(x.address[index])
                    }
                    console.log(ret,'reeeeee')
                 
                })
                return ret
            })

            res.render('admin/order',{ord,ret})
        } catch (error) {
            console.log(error)
            error.admin=true
            next(error)
        }
    },
    changeStatus : async(req,res,next)=>{
       try {
         const status = req.query.s
         console.log(status,'statusssssss')
         const orderId = req.query.id
         console.log(orderId)

         const upOrder = await Order.findOneAndUpdate({_id:orderId},{$set:{orderStatus:status}},{new:true})
         console.log(upOrder)
         if(upOrder.orderStatus==='cancelled'){
            const prod = upOrder.cart.items.map((el)=>{
                const pro = { productId:el.product_id,qty:el.qty}
                return pro
            })
            for(i=0;i<prod.length;i++){
                await products.findOneAndUpdate({ _id: prod[i].productId }, { $inc: { stock: prod[i].qty } })
            }
          
         }
         res.json({ status: true })
       } catch (error) {
        console.log(error)
        error.admin=true
            next(error)
       } 
    },
    orderProducts: async (req, res, next) => {
        try {
          const orderId = req.body.orderId
          console.log(orderId,'dddd')
          const orderDetials = await Order.findOne({ _id: orderId }).populate('cart.items.product_id')
          console.log(orderDetials,'dddtttt')
          res.json(orderDetials)
        } catch (error) {
          console.log(error)
          error.admin=true
            next(error)
        }
    },
    bannerAdd: (req, res,next) => {
        try {
            let err ;
            if(req.session.flashMssg){
                err = req.session.flashMssg;
                req.session.flashMssg = null
            }
        res.render('admin/addbanner')
      } catch (error) {
        console.log(error)
        error.admin=true
            next(error)
      }
    },
    PostBannerAdd: async (req, res,next) => {
        try {
        console.log(req.body,'bdddyyyy')
        const image = req.files
        console.log(image,"imgssssss");
        if (!image) {
          req.session.flashMssg = 'This is not a image file'
          res.redirect('/admin/add-banner')
        } else {
          let imageUrl = image[0].path
    
          imageUrl = imageUrl.substring(6)
          const banner = new Banner({
            title: req.body.title,
            image: imageUrl,
            url: req.body.url,
            description: req.body.description
          })
          banner.save((err, doc) => {
            if (err) {
              console.log(err)
            } else {
                console.log(banner,'bbbbbbrr');
              res.redirect('/admin/banner')
            }
          })
        }
        } catch (error) {
        console.log(error)
        error.admin=true
            next(error)
        }
    },
    banner: async (req, res,next) => {
        try {
            
          const Allban = await Banner.find()
          let err
          if(req.session.flashMssg){
            err = req.session.flashMssg;
            req.session.flashMssg = null
        }
          res.render('admin/banner', { Allban })
        } catch (error) {
          console.log(error)
          error.admin=true
            next(error)
        }
    },
    deleteBanner: async (req, res,next) => {
        try{
          const id = req.query.id
          await Banner.findOneAndDelete({ _id: id })
          res.redirect('/admin/banner')
        } catch (error) {
          console.log(error)
          error.admin=true
            next(error)
        }
    },
    addCoupons: (req, res,next) => {
        try {    
            res.render('admin/addCoupons')
        } catch (error) {
            console.log(error)
            error.admin=true
            next(error)
        }
    },
    postAddCoupons: (req, res) => {
      const coupon = new Coupon(req.body)
      coupon.save().then((doc) => {
          res.redirect('/admin/addCoupons')
          console.log('added')
        }).catch((error) => {
          console.log(error)
        })
      },
    coupons: async (req,res,next) => {
        try{
        const coupons = await Coupon.find()
        const c = { coup: '' }
        c.coup = coupons
        res.render('admin/coupon', { c })
       } catch (error) {
          console.log(error)
          error.admin=true
            next(error)
      }
      },
      deleteCoupon: async (req, res,next) => {
        try{
        const id = req.query.id
        await Coupon.findOneAndDelete({ _id: id })
        res.json({ status: true })
       } catch (error) {
          console.log(error)
          error.admin=true
            next(error)
       }
      },
      salesReport : async(req,res,next)=>{
        try {
         const sales = await Order.aggregate([{
            $match: {orderStatus:{$eq:'delivered'}, $and: [
                { date: { $gt: new Date(req.body.fromDate) } },
                { date: { $lt: new Date(req.body.toDate) } }
              ]}
         },{
            $group: {
              _id:{
                year : {$year : '$createdAt'},
                month : {$month : '$createdAt'},
                day : {$dayOfMonth : '$createdAt'}
              },
              totalPrice : {$sum:'$cart.totalPrice'},
              items : {$sum:{$size:'$cart.items'}},
              count : {$sum:1}
            }
         },{ $sort : {createdAt : -1}}]) 
         console.log(sales) 
         res.render('admin/sales',{sales}) 
        } catch (error) {
            console.log(error)
            error.admin=true
            next(error)
        }
      },
      monthlySalesReport : async (req,res,next)=>{
        try {
            const months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
              ]
            const sales = await Order.aggregate([{
                $match:{orderStatus:{$eq:'delivered'}},
            },{
                $group:{
                    _id:{
                        month:{$month:'$createdAt'}
                    },
                    totalPrice:{$sum:'$cart.totalPrice'},
                    items:{$sum:{$size:'$cart.items'}},
                    count:{$sum:1}
                }
            },{$sort:{createdAt:-1}}])
            console.log(sales)
            const salRe = sales.map((el)=>{
                const n = {...el}
                n._id.month = months[n._id.month - 1]
                return n
            })
            res.render('admin/monthlySales',{salRe})
        } catch (error) {
            console.log(error)
        }
      },
      yearlySalesReport : async(req,res)=>{
        const sales = await Order.aggregate([{
            $match:{orderStatus:{$eq:'delivered'}}
        },{
            $group:{
                _id:{
                    year:{$year:'$createdAt'}
                },
                totalPrice:{$sum:'$cart.totalPrice'},
                items:{$sum:{$size:'$cart.items'}},
                count:{$sum:1}
            }
        },{$sort:{createdAt:-1}}])
        res.render('admin/yearlySales',{sales})
      },
      chart1 : async(req,res)=>{
        try {
            const sales = await Order.aggregate([{
                $match: {orderStatus:{$eq:'delivered'}}
             },{
                $group: {
                  _id:{
                    month : {$month : '$createdAt'}
                  },
                  totalPrice : {$sum:'$cart.totalPrice'},
                  items : {$sum:{$size:'$cart.items'}},
                  count : {$sum:1}
                }
             },{ $sort : {createdAt : -1}}]) 
             console.log(sales)
             res.json({sales})
        } catch (error) {
            console.log(error)
            error.admin=true
            next(error)
        }
      }
    //   error : (req,res)=>{
    //     res.render('admin/error_404')
    //   }

}