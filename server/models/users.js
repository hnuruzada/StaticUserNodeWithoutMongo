const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const {Schema}=mongoose


const userSchema=new Schema({
    email:{type:String,required:true},
    password:{type:String,required:true}
},{timestamps:true})

userSchema.pre("save",async function(next){
        const round=10
       const hashPassword=await bcrypt.hash(this.password,round)
       this.password=hashPassword
    
    
next();
})

module.exports=mongoose.model("User",userSchema)