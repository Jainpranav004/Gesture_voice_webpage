const path=require('path')
const express=require('express')
const app=express()
const ejs=require('ejs')
app.use(express.json())
app.use(express.static(path.join(__dirname,'public')))
app.set('view engine','ejs')

app.get('/home',(req,res,next)=>{
    res.render('index.ejs',{url:req.protocol+"://"+req.headers.host})
    next()
})


module.exports=app; 