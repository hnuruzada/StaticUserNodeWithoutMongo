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
    const newProduct=new Products({
        title:req.body.title,
        price:req.body.price,
        image:req.file.path
    })
    await newProduct.save();
    res.status(201).json({message:"Product created"})
} catch (error) {
    res.status(500).json({message:error})
}
    
}

exports.updateProduct=async (req,res)=>{
try {
    const updatedProduct=await Products.findById(req.params.id)
    if(!updatedProduct){
        res.status(404).json({message:"Not Found"})
    }
    updatedProduct.title=req.body.title
    updatedProduct.price=req.body.price
    if(req.file){
        updatedProduct.image=req.file.path
    }
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