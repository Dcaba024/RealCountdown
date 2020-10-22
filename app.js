var express     = require("express");
const session   = require("express-session");
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
    bidRoutes = require("./routes/bids"),
    agentsRoute = require("./routes/agents"),
    buyersRoute = require("./routes/buyers"),
    buyerBidRoute = require("./routes/buyerbids"),
    reviewRoutes = require("./routes/reviews");
const MongoDBStore = require("connect-mongo")(session)




const dbUrl = process.env.DB_URL || "mongodb://localhost/realcountdown";


mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());

const secret = process.env.SECRET || "thisshouldbeabettersecret"

const   store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});


store.on("error", function(e){
    console.log("SESSION STORE ERROR", e)
});

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    store,
    secret,
    resave: false,
    saveUninitialized: true
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
app.use("/agents", agentsRoute);
app.use("/buyers", buyersRoute);
app.use("/buyers/:id/buyerbids", buyerBidRoute);
app.use("/agents/:id/reviews", reviewRoutes);





const port = process.env.port || 3000;
app.listen(port, function(){ 
    console.log("Serving on port" + port);
});