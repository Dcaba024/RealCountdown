var express = require("express");
var router = express.Router({mergeParams: true});
var Home = require("../models/homes");
var Bid = require("../models/bid");
var middleware = require("../middleware/index.js");
var User        = require("../models/user");



//NEW BID
router.get("/new", function(req, res){

    User.findById(req.params.id, function(err, buyer){
        if(err){
            console.log(err);
        } else{
            res.render("buyers/new",{buyer: buyer});
        }
    })
});


//CREATE NEW BID
router.post("/", function(req, res){
    User.findById(req.params.id, function(err, buyer){
        if(err){
            console.log(err);
            res.redirect("/buyers");
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
 
                     buyer.bids.push(bid);
                     buyer.save();
                     console.log(bid);
 
                     req.flash("success", "Successfully added a Bid");
                     res.redirect("/buyers/"+ buyer._id + "/show");
 
                }   
                
            });
        }
    });
});

module.exports = router;