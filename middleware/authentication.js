const fs = require("fs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const authentication = async (req,res,next)=>{
    const token = req.headers.authorization?.split(" ")[1]
    if(!token){
        res.status(500)
        res.send("Plz login")
    }else{
        const blacklist = JSON.parse(fs.readFileSync("./blacklist.json","utf-8"))
        if(blacklist.includes(token)){
            return res.send("Invalid token")
        }else{
            jwt.verify(token,process.env.secretkey, async(err, decoded)=> {
                if(err){
                    res.send({"msg":"plz log in","err":err})
                }else{
                    const userrole = decoded?.userrole;
                    req.body.userrole =userrole
                    next()
                }
            })
        }
    }
}
module.exports={
    authentication
}