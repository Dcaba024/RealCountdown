
var express = require("express");
var router = express.Router();
var passport    = require("passport")
var User        = require("../models/user");
var Home        = require("../models/homes");
var middleware = require("../middleware/index.js");


var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: "dsvhyoymi",
  api_key: process.env.API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET
});

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
router.post("/register",upload.single('image'), function(req, res){

    var image;
    console.log(req.file.path);
    cloudinary.uploader.upload(req.file.path, function(result) {
       
        
        var newUser = new User({
            username: req.body.username, 
            name: req.body.name,
            lastname: req.body.lastname,
            phoneNumber: req.body.phoneNumber,

            email: req.body.email,
             // add cloudinary url for the image to the home object under avatar property
            image: result.secure_url
        
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


//USER HOMES
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

//USER PROFILES
router.get("/users/:id/profile", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            req.flash("error", "Something Went Wrong");
            res.redirect("/");
        } else{
            res.render("users/profile", {user:foundUser ,currentUser: req.user});
        }
    });
});

//ABOUT US ROUTE
router.get("/about-us", function(req, res){
        res.render("aboutus");
});


//RESOURCES ROUTE
router.get("/resources", function(req, res){
    res.render("resources");
});

module.exports = router;