
async function createNewPost(req,res){
    try {
        const postsUrl = req.files.map(file=> file.path)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({status:false,message:"Internal Server Error"})
    }
}

module.exports = {createNewPost}