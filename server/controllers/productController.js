const Products=require("../models/product")
const mongoose=require("mongoose")


exports.getAllProduct=async (req,res)=>{
try {
    const products=await Products.find();
    res.json(products)
} catch (error) {
    res.status(500).send({message:error})
}

}

exports.getProductById=async (req,res)=>{
try {
    const product=await Products.findById(req.params.id)
    if(!product){
        return res.status(404).json({message:"Not Found"})
    }
    res.json(product)
} catch (error) {
    res.status(500).json({message:error})
}
    
}

exports.createProduct=async (req,res)=>{
try {
    const {title,price}=req.body
    const image=req.files.map(file=>file.path)
    const newProduct=new Products({
        title,price,image
    })
    await newProduct.save();
    res.status(201).json({message:"Product created"})
} catch (error) {
    res.status(500).json({message:error})
}
    
}

exports.updateProduct=async (req,res)=>{
try {
    const {title,price}=req.body
    const image=req.files.map(file=>file.path)
    const updatedProduct=await Products.findByIdAndUpdate(req.params.id)
    if(!updatedProduct){
        res.status(404).json({message:"Not Found"})
    }
    
    updatedProduct.title=title
    updatedProduct.price=price
    updatedProduct.image=image
   
    const saveProduct=await updatedProduct.save()
    res.json(saveProduct)

} catch (error) {
    res.status(500).json({message:error})
}
    
}

exports.deleteProduct=async (req,res)=>{

    try {
        const deletedProduct=await Products.findById(req.params.id)
        if(!deletedProduct){
            return    res.status(404).json({message:"Not Found"})
        }
        await deletedProduct.remove()
        res.status(201).json({message:"Product deleted"})
    } catch (error) {
        res.status(500).json({message:error})
    }
    
}