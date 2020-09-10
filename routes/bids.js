var express = require("express");
var router = express.Router({mergeParams: true});
var Home = require("../models/homes");
var Bid = require("../models/bid");
var middleware = require("../middleware/index.js");


//NEW BID
router.get("/new", function(req, res){
    Home.findById(req.params.id, function(err, home){
        if(err){
            console.log(err);
        } else{
            res.render("bids/new", {home: home});
        }
    });
    
});


//CREATE A BID
router.post("/", function(req, res){
    Home.findById(req.params.id, function(err, home){
        if(err){
            console.log(err);
            res.redirect("/homes");
        } else{
            console.log(req.body.bid);
            Bid.create(req.body.bid, function(err, bid){
                if(err){
                    console.log(req.body.Bid);
                } else {
                     //add username, and id to Bid
                     bid.author.id = req.user._id;
                     bid.author.username = req.user.username;
                     console.log("New Bid user name will be " + req.user.username);
 
                     //save bid
                     bid.save();
 
                     home.bids.push(bid);
                     home.save();
                     console.log(bid);
 
                     req.flash("success", "Successfully added a Bid");
                     res.redirect("/homes/"+ home._id);
 
                }   
                
            });
        }
    });
});

//SHOW BIDS
router.get("/:bid_id", function(req, res){
    Bid.findById(req.params.bid_id).exec(function(err, foundbid){

        if(err){
            console.log(err)
        } else {
            
            res.render("bids/show", {home:req.params.id, bid:foundbid, currentUser: req.user});
        }
    });

   
});

//EDIT BIDS
router.get("/:bid_id/edit", middleware.isLoggedIn, middleware.isUserAgent, function(req, res){
    
    Bid.findById(req.params.bid_id, function(err, foundbid){
        if(err){
            console.log(err);
        } else{
            res.render("bids/edit", {home_id: req.params.id, bid:foundbid, currentUser: req.user}); 
        }
    });

  
});

//UPDATE BIDS
router.put("/:bid_id", function(req,res){
    Bid.findByIdAndUpdate(req.params.bid_id, req.body.bid, function(err, updatedbid){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/homes/" + req.params.id);
        }
    });
});


//DESTROY BIDS
router.delete("/:bid_id", function(req,res){
    Bid.findByIdAndRemove(req.params.bid_id, function(err){
        if(err){
            console.log(err)
        } else{
            res.redirect("/homes/" + req.params.id);
        }
    })
});

module.exports = router;