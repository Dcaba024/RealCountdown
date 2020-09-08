
var express = require("express");
var router = express.Router();
var Home = require("../models/homes")
var middleware = require("../middleware/index.js");
// Image upload requires


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


//index 
router.get("/", function(req, res){
    
    //get all the homes from the db
    // Home.find({}, function(err, allhomes){
    //     if(err){
    //         console.log(err);
    //     } else{
    //          res.render("homes/index", {homes:allhomes, currentUser: req.user});
    //     }
    // });
   
    //query search
    var noMatch = '';
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Home.find({city: regex}).populate("bids").exec(function(err, allhomes){
            if(err){
                console.log(err);
            } else{
                
                if(allhomes.length < 1){
                     noMatch = "No campground match that query, please try again."
                }
                res.render("homes/index", {homes:allhomes, currentUser:req.user, noMatch:noMatch});
            }
        });


    } else{
        Home.find({}).populate("bids").exec(function(err, allhomes){
            if(err){
                console.log(err);
            } else{
                res.render("homes/index", {homes:allhomes, currentUser:req.user, noMatch:noMatch});
            }
        });
    

    }

  
});

//CREATE NEW HOME
router.post("/", middleware.isLoggedIn, upload.single('Image'), function(req, res){
    
    var address = req.body.address
    var street = req.body.street
    var city = req.body.city
    var state = req.body.state
    var zip = req.body.zip
    var Image
    var price = req.body.price
    var year = req.body.year
    var month = req.body.month
    var day = req.body.day



    var countdown = new Date(year, month, day).getTime();

    var expired = new Date(year,month - 1, day);

    var expiredDate = expired.toDateString();
    
    //var homeOwner = req.body.homeOwner
    var description = req.body.description


    var author = {};

    

    cloudinary.uploader.upload(req.file.path, function(result) {
        // add cloudinary url for the image to the campground object under image property
        Image = result.secure_url;
        // add author to campground
        author = {
          id: req.user._id,
          username: req.user.username
        }

        var newhome = {address:address, street:street, city:city, state:state, zip:zip, Image:Image, price:price, countdown:countdown, description:description, author:author, expiredDate:expiredDate}

        //create a new home and save to database
        Home.create(newhome, function(err, newlyCreated){
            if(err){
                console.log(err);
            }else{
                console.log(newlyCreated)
                res.redirect("/homes")
            }
        });

    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("homes/new.ejs");
});

//SHOW - shows more info about the house selected
router.get("/:id", function(req, res){
    //find the houses with the provided ID
    Home.findById(req.params.id).populate("bids").exec(function(err, foundHome){
        if(err){
            console.log(err);
        }else{
              //render show template with that house
            res.render("homes/show", {home:foundHome, currentUser: req.user});
        }
    });
});

//EDIT HOME ROUTE
router.get("/:id/edit", middleware.checkHomeOwnership, function(req, res){         
        Home.findById(req.params.id, function(err, foundHome){
            res.render("homes/edit", {home: foundHome});
        });
});

//UPDATE HOME ROUTE
router.put("/:id", function(req, res){

    
    //find and update the correct home
    Home.findByIdAndUpdate(req.params.id, req.body.home, function(err, updatedHome){
        if(err){
            res.redirect("/homes");
        } else{
                //redirect somewhere(show page)
            res.redirect("/homes/" + req.params.id);
        }
    })

});

//DESTROY HOME ROUTE
router.delete("/:id", middleware.checkHomeOwnership, function(req,res){
    Home.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/homes");
        } else{
            res.redirect("/homes");
        }
    })
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};



module.exports = router;

