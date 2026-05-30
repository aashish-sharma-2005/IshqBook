const bcrypt = require("bcrypt")
const testEmail = require("../../mail")
const Otp = require("../../models/otp")
const User = require("../../models/user")

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000)
}
async function getSignup(req, res) {
    try {
        res.render("signup")
    } catch (error) {
        console.log(error)
    }
}
async function postSignup(req, res) {
    try {
        const userInfo = req.body;
        userInfo.password = await bcrypt.hash(userInfo.password, 10)
        userInfo.email = userInfo.email.toLowerCase()
        const user = await User.create(userInfo)
        return res.status(200).json({status:true,message:"Account Created",user})
    } catch (error) {
        console.log(error)
    }
}
async function sendOtp(req, res) {
    try {
        const { email } = req.body;
        const user = await User.findOne({email})
        if(user) return res.status(400).json({status:false,message:"Email Already Exist"})
        await Otp.deleteMany({email})
        const otp = generateOTP();
        const sent = await testEmail(email, otp)
        if(!sent) return res.status(500).json({status:false,message:"Can't Send OTP"})
        const result = await Otp.insertOne({ email, otp, expiresAt: Date.now() + 2 * 60 * 1000 })
        if (result) return res.status(200).json({ success: true, message: "Otp Sent successfull" })
        else return res.status(500).json({ status: false, message: "Can't Sent Otp" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Can't Sent Otp" })
    }
}
async function verifyOtp(req, res) {
    try {
        const { email, otp } = req.body
        const data = await Otp.findOne({ email })
        if (!data) return res.status(404).json({ status: false, message: "OTP Not Found" })
        if (new Date() > data.expiresAt) {
            await Otp.deleteOne({ email })
            return res.status(400).json({ status: false, message: "OTP Expired" })
        }
        if (otp == data.otp) {
            await Otp.deleteOne({ email })
            return res.status(200).json({ status: true, message: "OTP Match" })
        }
        else return res.status(400).json({ status: false, message: "OTP Not Match" })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, message: "Server Error" })
    }

}
module.exports = { getSignup, postSignup, sendOtp, verifyOtp }