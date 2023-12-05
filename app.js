//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var encrypt = require('mongoose-encryption');

main().catch(err => console.log(err));

async function main() {
      await mongoose.connect('mongodb://127.0.0.1:27017/securityDB');
  }
  
  
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRECT;
console.log(secret);
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});
app.get("/login", function(req, res){
    res.render("login");
});
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save();
    res.render("secrets");
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}).then(foundUser => {
        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
            else {
                res.send("Wrong password");
            }
        } else {
            res.send("No user found");
        }
    }).catch(err => console.log(err));
});
        


app.listen(3000, function() {
  console.log("Server started on port 3000");
});