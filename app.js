const express = require("express"),
      app     = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      flash    = require("connect-flash"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      methodOverride = require("method-override");
      mongoose.set('useNewUrlParser', true),
      mongoose.set('useFindAndModify', false),
      mongoose.set('useCreateIndex', true),
      mongoose.set('useUnifiedTopology', true),      
      Campground = require("./models/campground"),
      Comment    = require("./models/comment"),
      User = require("./models/user"),
      seedDB = require("./seeds");

    //   Requiring Routes
    const commentRoutes         = require("./routes/comments"),
          campgroundsRoutes     = require("./routes/campgrounds"),
          indexRoutes           = require("./routes/index");

mongoose.connect("mongodb://localhost/yelpcampV11");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/assets"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());

//seedDB(); //Seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Sonic is amazing!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function(){
    console.log("YelpCamp server is running");
});