const express=require("express")
const cors=require("cors")
const bodyParser=require("body-parser")
const mongoose=require("mongoose")
const dotenv=require("dotenv")

dotenv.config()



 const {Schema}=mongoose;

const userSchema=new Schema({
    name:{type:String,required:true},
    surname:{type:String,required:true},
    age:{type:Number,required:true},
    image:{type:String,required:true}
},{timestamps:true}
)
const app=express()


//Midleware
app.use(cors())
app.use(bodyParser.json())

const Users=mongoose.model("users",userSchema)

//Get All Users

app.get("/users",async (req,res)=>{
    try {
        const users=await Users.find({})
        res.send(users)
    } catch (error) {
        res.status(500).json({message:error})
    }
})

//User get by id

app.get("/users/:id",async (req,res)=>{
    try {
        const user=await Users.findById(req.params.id)
        
            res.send(user)
       
    } catch (error) {
        res.status(500).json({message:error})
    }
})


//Add User
app.post("/users",(req,res)=>{
    const user=new Users({
        name:req.body.name,
        surname:req.body.surname,
        age:req.body.age,
        image:req.body.image
    })
    user.save()
    res.send({message:"User Created"})
})

//User Update
app.put("/users/:id",async (req,res)=>{
    try {
        const user=await Users.findByIdAndUpdate(req.params.id)

        if(user){
            user.name=req.body.name,
            user.surname=req.body.surname,
            user.age=req.body.age,
            user.image=req.body.image

            await user.save()
            res.json(user)
        }else{
            res.status(404).json({message:"Not Found"})
        }
    } catch (error) {
        res.status(500).json({message:error})
    }
})

//Delete User

app.delete("/users/:id",async (req,res)=>{
    try {
       await Users.findByIdAndDelete(req.params.id)
        res.status(200).json({message:"User Deleted"})
        
    } catch (error) {
        res.status(500).json({message:error})
    }
})

const PORT=process.env.PORT
const url=process.env.CONNECTION_URL.replace("<password>", process.env.PASSWORD)

mongoose.connect(url).catch(err=>console.log("Db not connect" + err))

app.listen(PORT,()=>{
        console.log("Server Connection");
})