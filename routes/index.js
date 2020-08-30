var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Render landing page
router.get("/", (req, res) => {
    res.render("landing");
});

// ===============================================
// AUTH ROUTES
// ===============================================
// Show register form
router.get("/register", (req, res) => {
    res.render("register");
});
// Handling user register
router.post("/register", (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if(err) {
            return res.render('register', {error: err.message});
        } else {}
        passport.authenticate("local")(req,res,function(){
            req.flash("success", `Welcome to YelpCamp ${user.username}`);
            res.redirect("/campgrounds");
        });
    });
});

// Login Routes
// Show login form
router.get("/login", (req, res) => {
    res.render("login");
});

// Handling user login
router.post("/login",passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}) ,(req, res) => {
});

// Logout route
router.get("/logout", (req,res) => {
    req.logout();
    req.flash("success", "Logged you out!")
    res.redirect("/campgrounds");
});

module.exports = router;
