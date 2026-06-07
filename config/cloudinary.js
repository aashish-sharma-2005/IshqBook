const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { v2: cloudinary } = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
const storage = new CloudinaryStorage({
    cloudinary,
    params: async(req,file)=>{
        let folder = 'IshqBook/misc'
        if(file.fieldname==="profilePic") folder = "IshqBook/profile"
        else if(file.fieldname === "coverPhoto") folder = "IshqBook/cover"
        else if(file.fieldname === "createPost") folder = "IshqBook/posts"
        return {folder,resource_type:"image"}
    }
})

module.exports = multer({ storage });