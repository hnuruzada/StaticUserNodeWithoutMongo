const express=require("express")
const cors=require("cors")
const bodyParser=require("body-parser")
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const session=require("express-session")
const bcrypt=require("bcrypt")
dotenv.config()



 const {Schema}=mongoose;

const userSchema=new Schema({
    username:{
        type:String,
        minLength: [6, 'Must be at least 6, got {VALUE}'],
        maxLength: 12,
        required:true},
    password:{type:String,required:true},
    
},{timestamps:true}
)
const app=express()

//Midleware
app.use(cors())
app.use(bodyParser.json())
app.use(session({
    secret:"abcd123gf2",
    resave:false,
    saveUninitialized:true
}))

const Users=mongoose.model("users",userSchema)

//User Register
app.post("/register",async (req,res)=>{
   try {
    const hashedPassword=await bcrypt.hash(req.body.password,10)
    const user=new Users({
        username:req.body.username,
        password:hashedPassword
    })
    await user.save();
    res.status(201).send("User Created")
   } catch (error) {
    res.status(500).json({message:error})
   }

})


//User Login
app.post("/login",async (req,res)=>{
    try {
        const user=await Users.findOne({username:req.body.username})
        if(user && await bcrypt.compare(req.body.password,user.password)){
            req.session.userId=user._id
            res.status(200).json({message:"User sign in"})
         }


    } catch (error) {
        res.status(500).send({message:error})
    }
})



const PORT=process.env.PORT
const url=process.env.CONNECTION_URL.replace("<password>", process.env.PASSWORD)

mongoose.connect(url).catch(err=>console.log("Db not connect" + err))

app.listen(PORT,()=>{
        console.log("Server Connection");
})