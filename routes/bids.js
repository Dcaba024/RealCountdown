var express = require("express");
var router = express.Router({mergeParams: true});
var Home = require("../models/homes");
var Bid = require("../models/bid");


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

module.exports = router;