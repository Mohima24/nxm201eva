const express = require("express")
const {connection}= require("./config/db")
const {userRoute} = require("./routs/user.routs")
const {authentication} = require("./middleware/authentication")

const jwt = require("jsonwebtoken")
const app = express()
app.use(express.json())
app.get("/",(req,res)=>{
    res.send("Home page")
})
app.get("/goldrate",authentication,(req,res)=>{
    res.send("goldrate page")
})
app.get("/userstats",authentication,(req,res)=>{
    res.send("goldrate page")
})
app.use("/user",userRoute)
app.listen(process.env.port,()=>{
    connection
    console.log(`listening to http://localhost:${process.env.port}`)
})