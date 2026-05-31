const { v2: cloudinary } = require("cloudinary");
const Friend = require("../../models/friend")
const User = require("../../models/user")

async function getProfile(req,res){
    try {
        const profileUserId = req.params.id;
        const currentUserId = req.user.userid;
        const userInfo = await User.findById({_id:profileUserId})
        if(!userInfo) return res.status(404).json({status:false})
        const friends = await Friend.find(
            {
            status:"accepted",
            $or:[
                {sender:req.params.id},
                {receiver:req.params.id}
            ]
            })
            .populate('sender receiver','name profilePic')
        const friendCount = friends.length;

        const isOwnProfile =
            profileUserId.toString() === currentUserId.toString();

        // Friendship status
        let friendship = null;

        if (!isOwnProfile) {
            friendship = await Friend.findOne({
                $or: [
                    { sender: currentUserId, receiver: profileUserId },
                    { sender: profileUserId, receiver: currentUserId }
                ]
            });
        }

        res.render("home", {
            page:"profile",
            userInfo,
            friends,
            friendCount,
            isOwnProfile,
            friendship,
            currentUserId
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false})
    }
}

async function uploadCover(req, res) {
    let uploadedPublicId = null;
    try {
        console.log(req.file);
        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "No file uploaded"
            });
        }
        uploadedPublicId = req.file.filename;
        const user = await User.findById(req.user.userid);
        if (!user) {
            await cloudinary.uploader.destroy(uploadedPublicId);
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }
        const oldPublicId = user.coverPhoto?.publicId;
        user.coverPhoto = {
            url: req.file.path,
            publicId: req.file.filename
        };
        await user.save();
        // DB save ho gaya, to ib purani image dalete do
        if (oldPublicId) {
            try {
                await cloudinary.uploader.destroy(oldPublicId);
            } catch (err) {
                console.log("Old cover delete error:", err);
            }
        }
        return res.json({
            status: true,
            coverPhoto: user.coverPhoto.url
        });
    } catch (err) {
        console.log(err);
        // Nayi upload hui thi lekin DB fail ho gaya
        if (uploadedPublicId) {
            try {
                await cloudinary.uploader.destroy(uploadedPublicId);
            } catch (deleteErr) {
                console.log(deleteErr);
            }
        }
        return res.status(500).json({
            status: false,
            message: "Cover upload failed"
        });
    }
}

function uploadProfile(req,res){
    try {
        
    } catch (error) {
        console.log(error)
    }
}

async function deleteCover(req, res) {
    try {
        const userid = req.user.userid;
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }
        if (!user.coverPhoto?.publicId) {
            return res.status(400).json({
                status: false,
                message: "Cover photo not found"
            });
        }
        await cloudinary.uploader.destroy(
            user.coverPhoto.publicId
        );
        user.coverPhoto = {
            url: "",
            publicId: ""
        };
        await user.save();
        return res.status(200).json({status: true,message: "Cover photo deleted"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: false,message: "Server Error"});
    }
}

function deleteProfile(req,res){
    try {
        
    } catch (error) {
        console.log(error)
    }
}

module.exports = {getProfile,uploadCover,uploadProfile,deleteCover,deleteProfile}