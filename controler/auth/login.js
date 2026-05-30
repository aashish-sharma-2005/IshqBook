const User = require("../../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

async function getLogin(req,res){
    try {
        res.render('login')
    } catch (error) {
        console.log(error)
    }
}
async function postLogin(req,res){
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({status:false,message:"Email Not Registered"})
        const result = await bcrypt.compare(password,user.password)
        if(result) {
            const payload = {userid:user._id,name:user.name,username:user.username,email:user.email,profilePic:user.profilePic}
            const token = jwt.sign(payload,process.env.secret,{expiresIn:"1d"})
            res.cookie("token",token,{
                httpOnly:true,
                secure:false,
                maxAge:1000*60*60
            });
            return res.status(200).json({status:true,message:"Welcome"})
        }
        else return res.status(200).json({status:false,message:"Email/Password Not Match"})
    } catch (error) {
        console.log(error)
    }
}

module.exports = {getLogin,postLogin}