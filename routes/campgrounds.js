var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
const campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX Route - Render all campgrounds from database on /campgrounds page
router.get("/", (req, res) => {
    // Get all campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err)
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

// NEW Route - Render new campground form page
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new")
});

// CREATE Route - Create new campground and save to database
router.post("/", middleware.isLoggedIn, (req, res)=> {
    // get data from form and create new campground variable
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image:image, description: description, author: author, price: price};
    // Create new campground and save to db, then redirect to campgrounds page
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/");
        }
    });
});

// SHOW Route - Show information for specific id
router.get("/:id", (req, res) => {
    // Find campground with given ID
    Campground.findById(req.params.id).populate("comments").exec((err,foundCampground) => {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            // Render the show template (show.ejs)
            res.render("campgrounds/show", {campground: foundCampground})
        }
    })
});

// EDIT Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", {campground: foundCampground})
    });
});

// UPDATE Route - find and update correct campground, then redirect to show page
router.put("/:id", middleware.checkCampgroundOwnership, (req,res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect(`/campgrounds/${req.params.id}`)
        }
    });
});

//DESTROY Route
router.delete("/:id", middleware.checkCampgroundOwnership, (req,res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;