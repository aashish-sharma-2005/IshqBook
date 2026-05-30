function logout(req,res){
    res.clearCookie("token");

    res.redirect("/auth");
}
module.exports = {logout}