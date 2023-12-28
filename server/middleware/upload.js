const multer=require("multer")


const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"uploads/")
    },
    filename:function(req,file,cb){
        cb(null,new Date().toISOString().replace(/:/g,'-')+'-'+file.originalname)
    }
})


//2*1024*1024=2MB
const upload=multer({
    storage:storage,
    limits:{fileSize:2*1024*1024}
})

module.exports=upload