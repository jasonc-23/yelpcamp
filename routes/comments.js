var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// NEW Route - Render new comment form
router.get("/new", middleware.isLoggedIn, (req, res) => {
    // Find campground with given ID
    Campground.findById(req.params.id, (err,foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            // Render the new comment template (comments/new.ejs) for that campground
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

// CREATE Route - Post new comment to campground with specific ID
router.post("/", middleware.isLoggedIn, (req, res )=> {
    // Get specific campground using ID
    Campground.findById(req.params.id, (err,campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // Create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    // Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // Save comment
                    comment.save();
                    // Connect comment and campground
                    campground.comments.push(comment);
                    campground.save();
                    // Redirect to campground show page
                    req.flash("success", "Successfully added comment");
                    res.redirect(`/campgrounds/${campground._id}`)
                }
            });
        }
    });
});

// EDIT Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Campground.findById(req.params.id, (err,foundCampground) => {
        if(err || !foundCampground) {
            req.flash("error", "No campground found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                console.log(err);
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
});

// UPDATE Route
router.put("/:comment_id", middleware.checkCommentOwnership, (req,res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect(`/campgrounds/${req.params.id}`)
        }
    });
});

//DESTROY Route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req,res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;