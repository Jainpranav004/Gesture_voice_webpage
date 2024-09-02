const User = require("./../models/usermodel.js");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");const User = require("../models/User");
// const bcrypt = require("bcryptjs");
const mongoose=require('mongoose')
const jwt = require("jsonwebtoken");


async function loginUser(req, res){
  const { email, password } = req.body;
  console.log(req.body);

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Email does not exist" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password" });
    }
    
    const token=jwt.sign({
      id:user._id,
      email:user.email,
      pwd:user.password
    },process.env.JWT_SECRET,{
      expiresIn: '1h'
    })

    // Login successful
    res.cookie("token",token)
    return res.redirect('/home');
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// const fullName=document.getElementsByTagName('input')[0];
// const email=document.getElementsByTagName('input')[1];
// const password=document.getElementsByTagName('input')[2];

 async function signup(req, res){
   const { fullName, email, password } = req.body;
   console.log(req.body);
  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }    
    const salt = await bcrypt.genSalt(10); // Generate salt
    const pwd = await bcrypt.hash(password, salt); // Hash the password with the salt
    await User.create({
        fullName:fullName,
        email:email,
        password:pwd,
    })
    return res.redirect('/home');
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" ,
      err
    });
  }
};        

module.exports={
  loginUser,signup
}
