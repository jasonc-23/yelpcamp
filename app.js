// Require all packages needed
const express               = require('express');
      campground            = require('./models/campground');
      mongoose              = require('mongoose');
      app                   = express();
      bodyParser            = require("body-parser");
      Campground            = require("./models/campground");
      Comment               = require("./models/comment");
      flash                 = require("connect-flash");
      methodOverride        = require("method-override");
      seedDB                = require("./seeds");
      passport              = require("passport");
      LocalStrategy         = require("passport-local");
      passportLocalMongoose = require("passport-local-mongoose");
      User                  = require("./models/user");

// Requiring routes
const commentRoutes         = require("./routes/comments"),
      campgroundRoutes      = require("./routes/campgrounds"),
      indexRoutes           = require("./routes/index");

// Allow js file to read ejs files without writing .ejs 
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Allow express to use files in /public including main.css
app.use(express.static(__dirname + "/public"));

// Set up database and create backup database URL if main one breaks
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelpcamp"
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// Use package which will allow flash messages
app.use(flash());

// Use PUT instead of post when specified
app.use(methodOverride("_method"));

// Run seed file
// seedDB();

// Configure passport for authentication
app.use(require("express-session")({
    secret: "Lumen is cute",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Allows currentUser variable to be available to every route as req.user. If we don't do this, currentUser is not available to each route unless explicitly written
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Using routes and adding prefixes so we don't need to repeat them in each file
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Create and listen for local server on port 3000
var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("YelpCamp Server Has Started!");
});