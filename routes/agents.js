var express = require("express");
var router = express.Router();
var User        = require("../models/user");



//INDEX
router.get("/", function(req, res){
    User.find({isAgent: true}).exec(function(err, foundAgents){
        if(err){
            console.log(err);
        } else{
            res.render("agents/index", {Agents:foundAgents});
        }
    })
   
});

//SHOW
router.get("/:id", function(req, res){
    User.findById(req.params.id).populate("bids").exec(function(err, foundAgent){
        if(err){
            console.log(err);
        } else{
            res.render("agents/show", {agent: foundAgent, currentUser: req.user});
        }
    });
});

//NEW AGENT BID
router.get("/:id/new", function(req, res){
   User.findById(req.params.id, function(err, foundAgent){
    if(err){
        console.log(err)
    } else{
        res.render("agents/new",{agent: foundAgent, currentUser: req.user});
    }
   });
});


//CREATE NEW BID
router.post("/", function(req, res){
    //need to create bid
});



module.exports = router;