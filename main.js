const path=require('path')
const express=require('express')
const userroute=require('./authentication/user.js')
const app=express()
const ejs=require('ejs')
app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))
app.set('view engine','ejs')
app.use('/user',userroute)


app.get('/home',(req,res,next)=>{
    // const logo="public/images/img1.png";
    res.render('index.ejs',{url:req.protocol+"://"+req.headers.host})
    next()
})

app.get('/signup',(req,res,next)=>{
    // const logo="public/images/img1.png";
    res.render('SignUP.ejs',{url:req.protocol+"://"+req.headers.host})
    next()
})
app.get('/login',(req,res,next)=>{
    // const logo="public/images/img1.png";
    res.render('Login.ejs',{url:req.protocol+"://"+req.headers.host})
    next()
})

app.get('/aboutus',(req,res,next)=>{
    // const logo="public/images/img1.png";
    res.render('AboutUs.ejs',{url:req.protocol+"://"+req.headers.host})
    next()
})
app.get('/help',(req,res,next)=>{
    // const logo="public/images/img1.png";
    res.render('Help.ejs',{url:req.protocol+"://"+req.headers.host})
    next()
})
app.get('/translation',(req,res,next)=>{
    // const logo="public/images/img1.png";
    res.render('SignToText.ejs',{url:req.protocol+"://"+req.headers.host})
    next()
})
app.get('/tutorials',(req,res,next)=>{
    // const logo="public/images/img1.png";
    res.render('tutorial.ejs',{url:req.protocol+"://"+req.headers.host})
    next()
})
module.exports=app; 