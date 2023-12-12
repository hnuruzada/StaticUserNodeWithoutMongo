const express=require("express")
const cors=require("cors")
const bodyParser=require("body-parser")
const app=express()

const PORT=8000

app.use(cors())
app.use(bodyParser.json())

let counter=6
let users=[
    {id:1,name:"Ali",surname:"Ismayilzade"},
    {id:2,name:"Asli",surname:"Nasirova"},
    {id:3,name:"Ilkin",surname:"Axhmedov"},
    {id:4,name:"Alpay",surname:"Abdullayev"},
    {id:5,name:"Kenan",surname:"Aliyev"}
]
app.get("/",(req,res)=>{
    res.send("Home Page")
})

app.get("/users",(req,res)=>{
    res.send(users)
})

//Get User by Id
app.get("/users/:id",(req,res)=>{
    const id=req.params.id
    // const {id}=req.params
    const selectUser=users.find(x=>x.id==id)

    if(selectUser){
        res.send(selectUser)
        res.status(200).json({message:"User tapildi"})
    }
    else{
        res.status(500).json({message:"User yoxdur!"})
    }
})



//Delete user
app.delete("/users/:id",(req,res)=>{
    const id=req.params.id
    const userId=users.find(x=>x.id==id)
    
    
    if(userId){
        const DeletedUser=users.filter(x=>x.id!=id)
        res.send(DeletedUser)
    res.status(200).json({message:"User Deleted!"})
    }else{
        res.status(404).json({message:"User Tapilmadi!"})
    }
})

//Add User

app.post("/users",(req,res)=>{
    const userObj={
        id:counter++,
        name:req.body.name,
        surname:req.body.surname
    }
    users.push(userObj)
    res.send(users)

})

//update User
app.put("/user/:id",(req,res)=>{
    const id=req.params.id
     users=users.filter(x=>x.id!=id)
    const updatedUser={
        id:id,
        name:req.body.name,
        surname:req.body.surname
    }
    users.push(updatedUser)
    users.sort((a,b)=>a.id-b.id)
    res.send(users)
})

app.listen(PORT,()=>{
    console.log("Server is connect!");
})