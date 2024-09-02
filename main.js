const {restrictedToLoginUser,checkAuth}=require('./middlewares/middles.js');
const connectDB=require('./connection.js')
connectDB()
const path=require('path')
const express=require('express')
const userroute=require('./authentication/user.js')
const app=express()
const ejs=require('ejs')
app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine','ejs')
app.set('views',path.resolve('./views'))
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
app.get('/opportunity',(req,res,next)=>{
    res.render('empowerment.ejs',{url:req.protocol+"://"+req.headers.host})
})
app.get('/community',(req,res,next)=>{
    // const logo="public/images/img1.png";
    res.render('community.ejs',{url:req.protocol+"://"+req.headers.host})
    next()
})
app.get('/modulo',(req,res,next)=>{
    res.render('modulo.ejs',{url:req.protocol+"://"+req.headers.host})
})
module.exports=app; 