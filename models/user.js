const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    username: {
        type: String,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    profilePic: {
        url: {
            type: String,
            default: ""
        },
        publicId: {
            type: String,
            default: ""
        }
    },

    coverPhoto: {
        url: {
            type: String,
            default: ""
        },
        publicId: {
            type: String,
            default: ""
        }
    },

    bio: {
        type: String,
        default: ""
    },

    role: {
        type: String,
        default: "user"
    },

    isVerified: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true });
const user = mongoose.model("User", userSchema);
module.exports = user;