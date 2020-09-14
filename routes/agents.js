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



module.exports = router;