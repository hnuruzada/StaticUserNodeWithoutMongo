const express=require("express")
const cors=require("cors")
const bodyParser=require("body-parser")
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const checkAuth=require("../server/middleware/auth")
// const router=express.Router();
const router=require("./routes/auth")
const productRouter=require("./routes/product")
dotenv.config()

const app=express()

app.use(cors())
app.use(bodyParser.json())


app.use("/api",router)
app.use("/product",productRouter)






 //Midleware


app.post("/",checkAuth,(req,res)=>{
    res.send("<h1>Salamlar</h1>")
})




const PORT=process.env.PORT
const url=process.env.CONNECTION_URL.replace("<password>", process.env.PASSWORD)

mongoose.connect(url).catch(err=>console.log("Db not connect" + err))

app.listen(PORT,()=>{
        console.log("Server Connection");
})