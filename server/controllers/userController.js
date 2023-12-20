const jwt=require("jsonwebtoken")
const User=require("../models/users")
const bcrypt=require("bcrypt")

exports.register=async (req,res)=>{
    const {email,password}=req.body
    const userExist=await User.findOne({email})
    if(userExist){
        return res.status(409).send("Email already exist")
    }
    const newUser=new User({
        email,
        password
    })

    await newUser.save()
    res.status(201).send("User created!")

}

exports.login=async(req,res)=>{
    const {email,password}=req.body
    const user=await User.findOne({email})
    if(!user || !(bcrypt.compare(password,user.password))){
        return res.status(401).send("Wrong User")
    }
    const token=jwt.sign({
        userId:user._id
    },'secretKey',{expiresIn:'60s'})
    res.send(token)
}