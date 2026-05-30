const Friend = require("../../models/friend")
const User = require("../../models/user")

async function getProfile(req,res){
    try {
        const profileUserId = req.params.id;
        const currentUserId = req.user.userid;
        const userInfo = await User.findById({_id:req.params.id})
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
            friendship
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({status:false})
    }
}

module.exports = {getProfile}