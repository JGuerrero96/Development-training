const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");


// INDEX ROUTE - Show all campgrounds

// Now "/campgrounds" turns into "/" because of the line 'app.use("/campgrounds", campgroundsRoutes);' from app.js
router.get("/", function(req, res){
    // Get All Maps from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("Maps not found");
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// CREATE - Add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    const name = req.body.name;
    const origin = req.body.origin;
    const price = req.body.price;
    const image= req.body.image;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampground = {name: name, origin: origin, price: price, image: image, description: desc, author: author};
    // Create new Map and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log("Map couldn't be added");
            console.log(err);
        }
        else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

// NEW - Show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// SHOW - Shows more info about a campground
router.get("/:id", function(req, res){
    // find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log("Error");
            console.log(err);
        }
        else{
            if (!foundCampground) {
                return res.status(400).send("Item not found.")
            }
            console.log(foundCampground);
            // render show template with that campground
    res.render("campgrounds/show", {campground: foundCampground});
            }
    });
});

// EDIT Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (!foundCampground) {
            return res.status(400).send("Item not found.")
        }
                res.render("campgrounds/edit", {campground: foundCampground});
            });
});

// Update Campground Route
router.put("/:id", middleware.checkCampgroundOwner, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else {
            if (!updatedCampground) {
                return res.status(400).send("Item not found.")
            }
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    // redirect somewhere(show page)
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwner, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;