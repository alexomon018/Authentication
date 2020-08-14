require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();
const encrypt = require('mongoose-encryption');

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/usersDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const usersSchema = new mongoose.Schema({
  email: String,
  password: String
})

usersSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:['password']});
const User = mongoose.model("user", usersSchema);

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});
app.route('/register')
.post((req,res)=>{
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save((err)=>{
        if(!err){
            res.render("secrets");
        }
    })
})
app.listen("3000", () => {
  console.log("Server has just starded moTharFucker");
});
app.route('/login').post((req,res)=>{
    const username =  req.body.username;
    const password =  req.body.password;
    User.findOne({email: username},(err,result)=>{
        if(err){
            console.log(err)
        }else{
            if(result){
                if(result.password === password){
                    res.render("secrets");
                }
            }
        }
    })});