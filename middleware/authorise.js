const authorise = (role)=>{
    return (req,res,next)=>{
        const userrole = req.body.userrole
        if(role.includes(userrole)){
            next()
        }else{
            res.send("not authorize")
        }
    }
}
module.exports={
    authorise
}