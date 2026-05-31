const express = require("express")
const upload = require("../config/cloudinary")

const router = express.Router()

const {getHome} = require("../controler/home/home")
const {getFriends,sendRequest,cancelRequest,acceptRequest} = require("../controler/friend/friend")
const {getNotifications,patchNotification} = require("../controler/notifications/notifications")
const {getProfile,uploadCover,uploadProfile,deleteCover,deleteProfile} = require("../controler/profile/profile")
const {notificationCount} = require("../midleware/user")
router.use(notificationCount)

router.get('/',getHome)
router.get('/friends',getFriends)
router.post('/send-request/:id',sendRequest)
router.delete('/cancel-request/:id',cancelRequest)
router.patch('/accept-request/:id',acceptRequest)

router.get('/notifications',getNotifications)
router.patch('/notifications/:id',patchNotification)

router.get('/profile/:id',getProfile)
router.patch('/profile/upload-cover',upload.single("coverPhoto"),uploadCover)
router.patch('/profile/upload-profile',upload.single("profilePic"),uploadProfile)
router.delete('/profile/delete-cover',deleteCover)
router.delete('/profile/delete-profile',deleteProfile);

module.exports = router;