const express = require("express")
const {Usermodel}= require("../models/user.model")
const fs = require("fs")
const jwt = require("jsonwebtoken")
const bcrypt= require("bcrypt")
const {authorise} = require("../middleware/authorise")
const {authentication} = require("../middleware/authentication")
const userRoute = express.Router()
require("dotenv").config()
userRoute.get("/",(req,res)=>{
    res.send("userpage")
})
userRoute.get("/userstats",authentication,authorise("manager"),(req,res)=>{
    res.send("userstats page")
})
userRoute.post("/signup",(req,res)=>{
    const {name,email,pass,role}= req.body
    bcrypt.hash(pass, 5 , async(err, hash)=> {
        if(err){
            res.send("bcrypt err")
        }else{
            const user = new Usermodel({name,email,pass:hash,role})
            await user.save()
            res.send("Signup Successfull")
        }
    })
})
userRoute.post("/login", async(req,res)=>{
    const {email,pass}= req.body;
    const user= await Usermodel.find({email})
    if(user){
        bcrypt.compare(pass, user[0].pass, async(err, result)=> {
            if(result){
                const normal_token = jwt.sign({"userID":user[0]._id,"userrole":user[0].role}, process.env.secretkey, { expiresIn: 60 })
                const refresh_token = jwt.sign({"userID":user[0]._id,"userrole":user[0].role}, process.env.refresh, { expiresIn: 300 })
                res.send({normal_token,refresh_token})
            }
        });
    }
})
userRoute.get("/logout",(req,res)=>{
    const token = req.headers.authorization?.split(" ")[1]
    const blacklist = JSON.parse(fs.readFileSync("./blacklist.json","utf-8"))
    blacklist.push(token)
    fs.writeFileSync("./blacklist.json", JSON.stringify(blacklist))
    res.send("Log out successfully")
})

userRoute.get("/newtoken",(req,res)=>{
    const token = req.headers.authorization?.split(" ")[1]
    if(!token){
        res.status(500)
        res.send({"msg":"plz log in"})
    }else{
        jwt.verify(token,process.env.refresh, async(err, decoded) => {
            if(err){
                res.status(500)
                res.send({"msg":"plz log in","err":err})
            }else{
                const normal_token = jwt.sign({"userID":decoded.userID,"userrole":decoded.userrole}, process.env.secretkey, { expiresIn: 60 })
                res.send({normal_token})
            }
        })
    }
})
module.exports={
    userRoute
}

// {
//     "name":"mohima",
//     "email":"mohima@gmail.com",
//     "pass":"mohima",
//     "role":"manager"
//   }