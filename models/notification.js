const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

    notifier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    notifiedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    type: {
        type: String,
        enum: [
            "request_receive",
            "request_accept",
            "profile_visit",
            "like",
            "comment",
            "reply",
            "mention",
            "follow",
            "unfollow",
            "message",
            "tag",
            "story_like",
            "story_reply",
            "post_share",
            "repost",
            "video_call",
            "voice_call",
            "group_invite",
            "admin_message",
            "system"
        ]
    },

    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },

    isRead: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("Notification", notificationSchema)