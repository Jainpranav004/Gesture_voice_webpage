const express=require('express')
const router=express.Router()
const mongoose = require('mongoose');
const {loginUser,signup}=require('./../Controllers/authController.js')

router.post('/signup',signup)



router.post('/login',loginUser)

module.exports=router;