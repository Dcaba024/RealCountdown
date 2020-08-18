
var express = require("express");
var router = express.Router();
var passport    = require("passport")
var User        = require("../models/user");
var Home        = require("../models/homes");
var middleware = require("../middleware/index.js");


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

    var newUser = new User({
        username: req.body.username, 
        email: req.body.email
    });

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
    }),function(req, res){
});

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/");
});


//USER PROFILES
router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "something went wrong");
            res.redirect("/");
        }
        Home.find().where('author.id').equals(foundUser._id).exec(function(err, homes){
            if(err){
                req.flash("error", "something went wrong");
                res.redirect("/");
            }
            res.render("users/show", {user: foundUser, homes: homes});
        });
        
    })
});


module.exports = router;