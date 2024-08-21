const dotenv=require('dotenv')
dotenv.config({path:'./config.env'})
const app=require('./main.js')
// console.log(process.env)
const server=app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})