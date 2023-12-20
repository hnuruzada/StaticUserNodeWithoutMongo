const mongoose=require("mongoose")

const {Schema}=mongoose


const productSchema=new Schema({
    title:{type:String},
    price:{type:Number},
    image:{type:String}
})

module.exports=mongoose.model("Products",productSchema)


