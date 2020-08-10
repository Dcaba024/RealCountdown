//all the middleware goes here

var Home = require("../models/homes");

var middlewareObj = {};

middlewareObj.checkHomeOwnership = function(req, res, next){
        //is user logged in?
        if(req.isAuthenticated()){
               
           Home.findById(req.params.id, function(err, foundHome){
               if(err){
                   res.redirect("back");
               } else{
                   //does user own the house?
                   if(foundHome.author.id.equals(req.user._id)){
                       next();
                   } else{
                       res.redirect("back");
                   }
                  
               }
           });
   
       } else{
           res.redirect("back");
       }
   

};

middlewareObj.isLoggedIn = function(req, res, next){
        if(req.isAuthenticated()){
            return next()
        }
        res.redirect("/login");
    
}


module.exports = middlewareObj