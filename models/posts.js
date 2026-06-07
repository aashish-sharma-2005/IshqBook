const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    caption: {
        type: String,
        trim: true,
        maxlength: 2000
    },

    photos: [{
        url: String,
        publicId: String
    }],

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    shares: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});