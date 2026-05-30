const jwt = require("jsonwebtoken");
const Notification = require("../models/notification")

function setUser(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect("/auth");
        }
        const decoded = jwt.verify(
            token,
            process.env.SECRET
        );
        req.user = decoded;
        res.locals.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.redirect("/auth");
    }
}
async function notificationCount(req, res, next) {
    res.locals.notificationCount = 0;
    if (req.user) {
        res.locals.notificationCount = await Notification.countDocuments({
            notifiedUser: req.user.userid,
            isRead: false
        });
    }
    next();
}
module.exports = {setUser,notificationCount};