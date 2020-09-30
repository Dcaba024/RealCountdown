var express = require("express");
var router = express.Router({mergeParams: true});
var User = require("../models/user");
var Review = require("../models/review");
var middleware = require("../middleware/index.js");


//INDEX
router.get("/", function(req, res){
    User.findById(req.params.id).populate({
        path: "reviews",
        options: {sort: {createdAt:-1}}// sorting the populated reviews array to show the latest first
    }).exec(function(err, agent){
        if(err || !agent) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/index", {agent: agent});
    });
});

module.exports = router;