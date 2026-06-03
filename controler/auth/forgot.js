const Otp = require("../../models/otp")
const User = require("../../models/user")
const testEmail = require('../../mail')
const bcrypt = require("bcrypt")
const session = require("express-session");

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000)
}
function getForgotPassword(req, res) {
    try {
        res.render('forgot')
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false,message:"Internal Server Error"});
    }
}
async function resetPassword(req, res) {
    try {
        console.log("changing")
        const { email, password } = req.body;
        if (password.length < 6) return res.status(400).json({status: false,message: "Password must be at least 6 characters"});
        if (!req.session.forgotVerified || req.session.forgotEmail !== email) {
            return res.status(401).json({ status: false, message: "OTP verification required" });
        }
        const user = await User.findOne({ email: email })
        if (!user) return res.status(404).json({ status: false, message: "User not found" });
        user.password = await bcrypt.hash(password, 10)
        await user.save()
        delete req.session.forgotVerified;
        delete req.session.forgotEmail;
        return res.status(200).json({ status: true })
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false,message:"Internal Server Error"});
    }
}
async function sendforgotOtp(req, res) {
    try {
        console.log("sending otp")
        const { email } = req.body;
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ status: false, message: "Email Not Registered" })
        await Otp.deleteMany({ email: email })
        const otp = generateOTP()
        const sent = await testEmail(email, otp)
        if (!sent) return res.status(500).json({ status: false, message: "Can't Send OTP" })
        const result = await Otp.create({email,otp,expiresAt: Date.now() + 2 * 60 * 1000});
        if (result) return res.status(200).json({ status: true, message: "Otp Sent successfull" })
        else return res.status(500).json({ status: false, message: "Can't Sent Otp" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false,message:"Internal Server Error"});
    }
}
async function verifyForgotOtp(req, res) {
    try {
        console.log("verify")
        const { email, otp } = req.body;
        const data = await Otp.findOne({ email })
        if (!data) return res.status(404).json({ status: false, message: "OTP Not Found" })
        if (new Date() > data.expiresAt) {
            await Otp.deleteOne({ email })
            return res.status(400).json({ status: false, message: "OTP Expired" })
        }
        if (otp == data.otp) {
            await Otp.deleteOne({ email })
            req.session.forgotVerified = true;
            req.session.forgotEmail = email;
            return res.status(200).json({ status: true, message: "OTP Match" })
        }
        else return res.status(400).json({ status: false, message: "OTP Not Match" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false,message:"Internal Server Error"});
    }
}
module.exports = { getForgotPassword, resetPassword, sendforgotOtp, verifyForgotOtp }