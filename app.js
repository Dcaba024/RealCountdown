var express     = require("express");
var app         = express();
var bodyParser  = require("body-parser");
var mongoose    = require("mongoose");
var flash       = require("connect-flash");
var Home        = require("./models/homes");
var passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User        = require("./models/user");
    require('dotenv').config();
var homeRoutes = require("./routes/homes"),
    indexRoutes = require("./routes/index"),
    bidRoutes = require("./routes/bids");







mongoose.connect("mongodb://localhost/realcountdown", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());



// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "1 + 1 = 2",
    resave: false,
    saveUninitialized: false
}));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())


app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");

    next();
});

// Home.create({
//     address: "7910 taft st apt205", Image: "https://si.wsj.net/public/resources/images/B3-DM067_RIGHTS_IM_20190319162958.jpg", homeOwner: "Nicholus cruz", description: "Nice 4 bedroom apartment"
    
// }, function(err, home){
//     if(err){
//         console.log(err);
//     } else{
//         console.log("NEWLY CREATED HOME");
//     }
// });

app.use("/homes",homeRoutes);
app.use(indexRoutes);
app.use("/homes/:id/bids", bidRoutes);




app.listen(3000, function(){ 
    console.log("RealCountdown server has started!!");
});