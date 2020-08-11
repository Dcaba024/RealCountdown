
var express = require("express");
var router = express.Router();
var passport    = require("passport")
var User        = require("../models/user");


router.get("/", function(req,res){
    res.render("landing");
});

//=================
//AUTH ROUTES


//show register form
router.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){

    var newUser = new User({username: req.body.username});
    if(req.body.agentCode ==='secretcode123'){
        newUser.isAgent = true;
    }
    console.log(newUser);
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/homes");
            });
        }
    });
});


//show login form
router.get("/login", function(req, res){
        res.render("login");
});

//handling login logic
router.post("/login", passport.authenticate("local",{
        successRedirect: "/homes",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});


module.exports = router;