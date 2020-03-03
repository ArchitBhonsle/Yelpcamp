const express = require("express"),
    router = express.Router(),
    middleware = require("../middleware"),
    passport = require("passport"),
    User = require("../models/user");

// Landing page
router.get("/", function(req, res) {
    res.render("landing");
});

// Go to register form
router.get("/register", function(req, res) {
    res.render("register");
});

// Request to register
router.post("/register", function(req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function(err, createdUser) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/campgrounds");
            });
        }
    });
});

// Go to login form
router.get("/login", function(req, res) {
    res.render("login");
});

// Login request
router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect : "/campgrounds",
        failureRedirect : "/login"
    }),
    function(req, res) {}
);

// Logout request
router.get("/logout", function(req, res) {
    req.logOut();
    res.redirect("/campgrounds");
});

module.exports = router;
