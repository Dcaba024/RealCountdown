//all the middleware goes here

var Home = require("../models/homes");
var User = require("../models/user");

var middlewareObj = {};

middlewareObj.checkHomeOwnership = function(req, res, next){
        //is user logged in?
        if(req.isAuthenticated()){
               
           Home.findById(req.params.id, function(err, foundHome){
               if(err){
                   req.flash("error", "Home not found!");
                   res.redirect("back");
               } else{
                   //does user own the house?
                   if(foundHome.author.id.equals(req.user._id)){
                       next();
                   } else{
                       req.flash("error", "You dont have permission to do that");
                       res.redirect("back");
                   }
                  
               }
           });
   
       } else{
           req.flash("error", "You need to be logged in to do that!");
           res.redirect("back");
       }
   

};

middlewareObj.isLoggedIn = function(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    
};

middlewareObj.isUserAgent = function(req, res, next){
            if(!req.user.isAgent){
                req.flash("error", "You are not a agent");
                res.redirect("back");
            }

            if(err){
                req.flash("error", "User not found");
                res.redirect("back");
                
            } else{
                console.log(foundUser);
                next();
            
            }
    

};


module.exports = middlewareObj