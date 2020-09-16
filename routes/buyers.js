var express = require("express");
var router = express.Router();
var User        = require("../models/user");



//INDEX
router.get("/", function(req, res){
    User.find({isBuyer: true}).exec(function(err, foundBuyers){
        if(err){
            console.log(err);
        } else{
            res.render("buyers/index", {buyers:foundBuyers, currentUser: req.user});
        }
    });
       
});

//NEW BUYER ADDED TO THE DATABASE
router.get("/:id/new", function(req, res){

    User.updateOne({_id:req.user._id}, {
        isBuyer: true
    }, function(err){
        if(err){
            console.log(err);
        } else{
            console.log(req.user);
            res.redirect("/buyers");
        }
    })
   
});


module.exports = router;