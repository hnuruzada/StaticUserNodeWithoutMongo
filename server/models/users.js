const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const {Schema}=mongoose
const jwt=require("jsonwebtoken")



const userSchema=new Schema({
    email:{type:String,required:true},
    password:{type:String,required:true},
    username:{type:String,required:true},
    basket:[{type:String}],
    wishlist:[{type:String}],
    role:{type:String,enum:["superAdmin","admin","user"],default:"user"},
    isVerified:{type:Boolean,default:false},
    resetToken:{type:String},
    resetTokenExpiration:{type:Date}

},{timestamps:true})

userSchema.pre("save",async function(next){
    const user=this
        if(!user.isModified('password')){
            return next()
            
        }
      
        const salt=await bcrypt.genSalt(10)
        const hash=await bcrypt.hash(user.password,salt)
        user.password=hash
    
    next();
})

userSchema.methods.generateAuthToken=function(){
    const user=this
    const token=jwt.sign({
        _id:user._id,
        email:user.email,
        role:user.role
    },'secretKey')
    return token
}

userSchema.methods.generateResetToken=function(){
    const user=this
    const resetToken=jwt.sign({
        _id:user._id
    },"resetKey",{expiresIn:"1h"})

    user.resetToken=resetToken
    user.resetTokenExpiration=Date.now()+3600000;//indiki vaxt + 1saat

    return resetToken
}

module.exports=mongoose.model("User",userSchema)