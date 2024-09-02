const {getUser}=require("./../Controllers/auth")
const jwt=require('jsonwebtoken')
async function restrictedToLoginUser(req,res,next){
const userUid=req.cookies?.token
console.log(userUid)
if(!userUid){
    return res.redirect('/login')
}

const user=getUser(userUid)
console.log(user)
if(!user) return res.redirect('/login')

  req.user=user
  next()
}

async function checkAuth(req,res,next){
  const userUid=req.cookies?.token

const user=getUser(userUid)

  req.user=user
  next()  
}

module.exports={
    restrictedToLoginUser,checkAuth
}