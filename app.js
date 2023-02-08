if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const ejs = require('ejs')
const userRouter = require('./router/user')
const adminRouter = require('./router/admin')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const nocahe = require('nocache')
const path = require('path')
app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'views'))
app.set('layout', 'layouts/layout')

const {dbConnection} = require('./config/dbConnection')
const { log } = require('console')

dbConnection((response)=>{
    if(response){
        console.log('mongoose running...');
    }else{
        console.log('error occured');
    }
})

app.use(nocahe());
app.use(session({ secret: 'key', cookie: { maxAge: 60000000 }, resave: true, saveUninitialized: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(expressLayouts)
app.use('/', userRouter)
app.use('/admin',adminRouter)

app.use(function(req, res, next) {
    const error = new Error(`Not found ${req.originalUrl}`)
    if(req.originalUrl.startsWith('/admin')){
      error.admin=true
    }
    error.status = 404
    next(error)
      });
      
      // error handler
      app.use(function(err, req, res, next) {
    console.log(err);
        // render the error page
        // res.status(err.status || 500);
        if(err.status==404){
          if(err.admin){
            res.render('errorAdmin_404',{error:err.message});
          }else{
            console.log("hiiiiiiiii");
            res.render('error_404',{error:err.message});
          }
  
        }else{
            if(err.status==500){
                res.render('error_500',{error:'unfinded error'})
            }else{
          if(err.admin){
            console.log('yutytytyt');
            res.render('errorAdmin_404',{error:'server down'})
          }else{
            res.render('error_404',{error:'server down'})
          }
            }
          }
      })
app.listen(3000)