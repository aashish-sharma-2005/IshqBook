const Notification = require("../../models/notification")

async function getNotifications(req,res){
    try {
        const data = await Notification.find({notifiedUser:req.user.userid})
        .populate('notifier','username profile')
        .sort({createdAt:-1})
        res.render('home',{page:"notification",data})
    } catch (error) {
        console.log(error)
    }
}

async function patchNotification(req,res){
    try {
        const result = await Notification.deleteOne({_id:req.params.id})
        if(result) return res.status(200).json({status:true})
        else return res.status.json({status:false})
    } catch (error) {
        console.log(error)
    }
}

module.exports = {getNotifications,patchNotification}