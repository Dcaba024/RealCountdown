
var express = require("express");
var router = express.Router();
var Home = require("../models/homes")
var middleware = require("../middleware/index.js");


//index show all homes to the Agents
router.get("/", middleware.isLoggedIn, function(req, res){
    
    //get all the homes from the db
    Home.find({}, function(err, allhomes){
        if(err){
            console.log(err);
        } else{
             res.render("homes/index", {homes:allhomes, currentUser: req.user});
        }
    });
   
});

//CREATE NEW HOME
router.post("/", middleware.isLoggedIn, function(req, res){
    var address = req.body.address
    var Image = req.body.Image
    //var homeOwner = req.body.homeOwner
    var description = req.body.description
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newhome = {address:address, Image:Image, description:description, author:author}
   

    //create a new home and save to database
    Home.create(newhome, function(err, newlyCreated){
        if(err){
            console.log(err)
        }else{
            console.log(newlyCreated)
            res.redirect("/homes")
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("homes/new.ejs");
});

//SHOW - shows more info about the house selected
router.get("/:id", function(req, res){
    //find the houses with the provided ID
    Home.findById(req.params.id, function(err, foundHome){
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
})



module.exports = router;

