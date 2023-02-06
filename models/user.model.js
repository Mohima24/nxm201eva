const mongoose= require("mongoose")
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    pass:String,
    role:{type:String,enum:["manager","customer"],default:"customer"}
})
const Usermodel=mongoose.model("user",userSchema)
module.exports={
    Usermodel
}