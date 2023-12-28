const express=require("express")
const router=express.Router()
const authController=require("../controllers/userController")
const auth = require("../middleware/auth")


router.post("/register",authController.register)
router.post("/login",authController.login)
router.post("/forgotPassword",authController.forgotPassword)
router.post("/resetPassword",authController.resetPassword)
router.post("/verifyEmail",authController.verifyEmail)

module.exports=router