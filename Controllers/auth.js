// const sessionIdToUsermap=new Map();
const jwt=require('jsonwebtoken')

function setUser(user){
    return jwt.sign({
        id:user._id,
        email:user.email
    },process.env.SECRET_KEY)
}

function getUser(token){
    if(!token) return null;
    try{
        return jwt.verify(token,process.env.SECRET_KEY)
    }catch(e){
        return null;
    }
}

module.exports={
    setUser,getUser
}