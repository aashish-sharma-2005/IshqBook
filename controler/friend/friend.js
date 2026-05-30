const User = require("../../models/user")
const Friend = require("../../models/friend")
const Notification = require("../../models/notification")

async function getFriends(req, res) {
    try {
        const currentUserId = req.user.userid;

        // 1. Get all relations of current user
        const relations = await Friend.find({
            $or: [
                { sender: currentUserId },
                { receiver: currentUserId }
            ]
        });

        // 2. Build relation map
        const relationMap = new Map();

        relations.forEach(r => {
            const otherId =
                r.sender.toString() === currentUserId.toString()
                    ? r.receiver.toString()
                    : r.sender.toString();

            relationMap.set(otherId, {
                status: r.status,
                sender: r.sender,
                receiver: r.receiver
            });
        });

        // 3. Get all users except current user
        const users = await User.find({
            _id: { $ne: currentUserId }
        });

        // 4. Hide accepted friends and prepare data
        const finalUsers = users
            .filter(user => {
                const relation = relationMap.get(user._id.toString());

                // Accepted friends hide karne hain
                return relation?.status !== "accepted";
            })
            .map(user => {
                const relation = relationMap.get(user._id.toString());

                return {
                    _id: user._id,
                    name: user.name,
                    username: user.username,
                    profilePic: user.profilePic,
                    bio: user.bio,

                    status: relation?.status || null,
                    sender: relation?.sender || null,
                    receiver: relation?.receiver || null
                };
            });
        // 5. Render page
        res.render("home", {
            page: "friend",
            users: finalUsers,
            currentUserId
        });

    } catch (error) {
        console.log(error);
        res.redirect("/home");
    }
}
async function sendRequest(req, res) {
    try {
        const id = req.params.id;
        const alreadySent = await Friend.findOne({ sender: req.user.userid, receiver: id });
        if (alreadySent) return res.status(400).json({ status: false, message: "Request already sent" })
        const result = await Friend.insertOne({ sender: req.user.userid, receiver: id })
        await Notification.create({ notifier: req.user.userid, notifiedUser: id, type: "request_receive" });
        if (result) return res.status(200).json({ status: true })
        else return res.status(500).json({ status: false })
    } catch (error) {
        console.log(error)
    }
}
async function cancelRequest(req, res) {
    try {
        const id = req.params.id;
        const result = await Friend.deleteOne({ sender: req.user.userid, receiver: id })
        await Notification.deleteOne({ notifier: req.user.userid, notifiedUser: id, type: "request_receive" });
        if (result.deletedCount > 0) return res.status(200).json({ status: true })
        else return res.status(500).json({ status: false })
    } catch (error) {
        console.log(error)
    }
}
async function acceptRequest(req, res) {
    try {
        const id = req.params.id;
        const result = await Friend.updateOne({ sender: id, receiver: req.user.userid }, { $set: { status: "accepted" } })
        await Notification.create({ notifier: req.user.userid, notifiedUser: id, type: "request_accept" });
        await Notification.deleteOne({ notifier: id, notifiedUser: req.user.userid })
        if (result.modifiedCount > 0) return res.status(200).json({ status: true })
        else return res.status(404).json({ status: false })
    } catch (error) {
        console.log(error)
    }
}

module.exports = { getFriends, sendRequest, cancelRequest, acceptRequest }