var express = require("express");
var router = express.Router({mergeParams: true});
var User = require("../models/user");
var Review = require("../models/review");
var middleware = require("../middleware/index.js");



//NEW 
router.get("/new", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, agent){
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/new", {agent: agent});
    })
})

module.exports = router;