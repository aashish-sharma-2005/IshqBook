require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const connect = require("./config/connectDB");
const {setUser} = require("./midleware/user");
connect();

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.set('view engine','ejs');

app.get('/',(req,res)=>{
    res.redirect('/auth');
});
app.use('/auth',require("./routes/auth"));
app.use('/welcome',setUser,require("./routes/welcome"));
app.use('/home',setUser,require("./routes/home"));

app.listen(process.env.PORT,()=>{
    console.log("Server Started");
});