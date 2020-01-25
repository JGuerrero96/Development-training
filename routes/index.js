const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");


// Root Route
router.get("/", function(req, res){
    res.render("landing");
});

// ==========================
// AUTH ROUTES
// ==========================

// Show register form

router.get("/registration", function(req, res){
    res.render("registration")
});

// Handle sign up logic
router.post("/registration", function(req, res){
    const newUser = new User({username: req.body.username}); 
    // const newPassword = new Password({password: req.body.password});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("registration");
        }
        passport.authenticate("local")(req,res, function(){
            req.flash("success", "Welcome to yelpcamp " + user.username + "!");
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res){
    res.render("login");
});

// handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged out successfully");
    res.redirect("/campgrounds");
});

module.exports = router;