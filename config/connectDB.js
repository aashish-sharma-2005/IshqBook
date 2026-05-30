const mongoose = require("mongoose")
async function connectDB(){
    try{
        mongoose.connect(process.env.MONGO_URL);
        console.log("DataBase Connected");
    }catch(err){
        console.log("Not Connected")
        console.log(err)
    }
}
module.exports = connectDB;