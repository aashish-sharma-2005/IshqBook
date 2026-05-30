

async function welcome(req,res){
    try {
        res.render("welcome")
    } catch (error) {
        console.log(error)
    }
}

module.exports = {welcome}