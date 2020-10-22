var express = require("express");
var router = express.Router();
var User        = require("../models/user");
var middleware = require("../middleware/index.js");



//INDEX
router.get("/",middleware.isLoggedIn, function(req, res){
    User.find({isAgent: true}).exec(function(err, foundAgents){
        if(err){
            console.log(err);
        } else{
            res.render("agents/index", {Agents:foundAgents, currentUser: req.user});
        }
    })
   
});

//SHOW
router.get("/:id",middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id).populate("bids").exec(function(err, foundAgent){
        if(err){
            console.log(err);
        } else{
            res.render("agents/show", {agent: foundAgent, currentUser: req.user});
        }
    });
});

//NEW AGENT BID
router.get("/:id/new",middleware.isLoggedIn, function(req, res){
   User.findById(req.params.id, function(err, foundAgent){
    if(err){
        console.log(err)
    } else{
        res.render("agents/new",{agent: foundAgent, currentUser: req.user});
    }
   });
});





module.exports = router;