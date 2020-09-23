var express = require("express");
var router = express.Router();
var User        = require("../models/user");



//INDEX
router.get("/", function(req, res){
    // User.find({isBuyer: true}).exec(function(err, foundBuyers){
    //     if(err){
    //         console.log(err);
    //     } else{
    //         res.render("buyers/index", {buyers:foundBuyers, currentUser: req.user});
    //     }
    // });

     //query search
     var noMatch = '';
     if(req.query.search){
         const regex = new RegExp(escapeRegex(req.query.search), 'gi');
         User.find({isBuyer: true, city: regex}).populate("bids").exec(function(err, foundBuyers){
             if(err){
                 console.log(err);
             } else{
                 
                 if(foundBuyers.length < 1){
                      noMatch = "No campground match that query, please try again."
                 }
                 res.render("buyers/index", {buyers:foundBuyers, currentUser: req.user, noMatch:noMatch});
             }
         });
 
 
     } else{
         User.find({isBuyer: true}).populate("bids").exec(function(err, foundBuyers){
             if(err){
                 console.log(err);
             } else{
                 res.render("buyers/index", {buyers:foundBuyers, currentUser: req.user, noMatch:noMatch});
             }
         });
     
 
     }
 
       
});

//NEW BUYER ADDED TO THE DATABASE
router.get("/:id/new", function(req, res){

    var d = new Date();
    var year = d.getFullYear();
    var day = d.getDate();
    day += 7;
    var month = d.getMonth();
    var expired = new Date(year,month, day);

    var expiredDate = expired.toDateString();
    console.log("year = " + year + "\n Month = " + month);
    var BuyerCountdown = new Date(year, month, day).getTime();

    User.updateOne({_id:req.user._id}, {
        isBuyer: true,
        countdown: BuyerCountdown,
        expiredDate: expiredDate

    }, function(err){
        if(err){
            console.log(err);
        } else{
            console.log(req.user);
            res.redirect("/buyers");
        }
    })
   
});


//SHOW 


module.exports = router;