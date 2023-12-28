const jwt=require("jsonwebtoken")
const User=require("../models/users")
const bcrypt = require('bcrypt');

const nodemailer=require("nodemailer")
const dotenv=require("dotenv")
dotenv.config()

const transport=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.email,
        pass:process.env.pass
    }
})


const register=async (req,res)=>{
    try {
        const newUser=new User(req.body)
        
        await newUser.save()
        const token=newUser.generateAuthToken()
        console.log(token);
        res.status(200).send({token})
    } catch (error) {
        res.status(500).send(error)
    }
}

const login=async (req,res)=>{
try {
    const {email,password}=req.body
    const user=await User.findOne({email})
    if(!user){
        res.status(404).send("User Not Found!")
    }
    const isPasswordMatch=await bcrypt.compare(password,user.password)

    if(!isPasswordMatch){
        res.status(409).send("Usernam and Password wrong")
    }
    if(!user.isVerified){
        res.status(409).send("Email not activated")
    }

    const token=user.generateAuthToken()
    res.send({token})
} catch (error) {
    res.status(401).send(error)
}
}

const forgotPassword=async (req,res)=>{
    try {
        const {email}=req.body
        const user=await User.findOne({email})

        if(!user){
            res.status(404).send("User Not Found")
        }

        const resetToken=user.generateResetToken()
        await user.save()

        const mailOptions={
            from:"h.nuruzade@gmail.com",
            to:user.email,
            subject:"Password Reset",
            text:`Click link to reset password http://localhost:5000/api/reset-password?token=${resetToken}`

        }

        transport.sendMail(mailOptions,(err,info)=>{
            if(err){
                console.log(err.message);
            }
            else{
                console.log("Mail sent: " + info.response);
                res.send("Reset email send")
            }
        })



    } catch (error) {
        res.status(500).send(error.message)
    }
}

const resetPassword=async (req,res)=>{
    try {
        const {resetToken,newPassword}=req.body

        const decodeToken=jwt.verify(resetToken,'resetKey')

        const user=await User.findOne({
          _id:decodeToken._id,
        resetToken,
        resetTokenExpiration:{$gt:Date.now()}
        })
        if(!user){
            res.status(404).send("User Not Found")
        }
        user.password=newPassword
        user.resetToken=undefined
        user.resetTokenExpiration=undefined

        await user.save()
        res.send("Password reset successfully")



    } catch (error) {
        res.status(500).send(error.message)
    }
}

const verifyEmail=async (req,res)=>{
    try {
        const {email}=req.body
        const user=await User.findOne({email})
        if(!user){
            res.status(404).send("User not found!")
        }
        user.isVerified=true
        await user.save()

        res.send("User Email verified")

    } catch (error) {
        res.status(500).send(error.message)
    }
}

module.exports={
    register,login,forgotPassword,resetPassword,verifyEmail
}