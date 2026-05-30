
function getHome(req,res){
    try {
        res.render("home",{page:"home"})
    } catch (error) {
        console.log(error)
    }
}
module.exports = {getHome}