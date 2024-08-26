const express=require('express')
const router=express.Router()

router.post('/signup',async(req,res,next)=>{
    const {email,password}=req.body;
    //check for this if correct
    res.redirect('/home')
})



router.post('/login',async(req,res,next)=>{
    const {email,password}=req.body;
    //check for this if correct
    res.redirect('/home')
})

module.exports=router;