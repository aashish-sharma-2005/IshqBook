const express = require("express")
const router = express.Router()
const {getLogin,postLogin} = require("../controler/auth/login")
const {getSignup,postSignup,sendOtp,verifyOtp} = require("../controler/auth/signup")
const {logout} = require("../controler/auth/logout")

router.get('/',(req,res)=>{res.redirect('/auth/login')})
router.get('/login',getLogin)
router.post('/login',postLogin)
router.get('/signup',getSignup)
router.post('/signup',postSignup)
router.post('/send-otp',sendOtp)
router.post('/verify-otp',verifyOtp)
router.get('/logout',logout)

module.exports = router;