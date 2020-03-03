const express = require("express"),
    router = express.Router({ mergeParams: true }),
    middleware = require("../middleware"),
    Campground = require("../models/campground"),
    Comment = require("../models/comment");

// Index Page
router.get("/", function(req, res) {
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
        }
    });
});

// Adding a new campground
router.post("/", middleware.isLoggedIn, function(req, res) {
    let author = {
        id       : req.user.id,
        username : req.user.username
    };
    let newCampground = {
        name        : req.body.name,
        image       : req.body.image,
        description : req.body.description,
        author      : author
    };
    Campground.create(newCampground, function(err, addedCampground) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success", "Campground successfully added.");
            res.redirect("/campgrounds");
        }
    });
});

// Form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// Show page for individual campground
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

// Go to the edit campground form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", { campground: foundCampground });
        }
    });
});

// Edit campground request
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.editedCampground, function(err, updatedCampground) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success", "Campground successfully edited.");
            res.redirect("/campgrounds/" + updatedCampground.id);
        }
    });
});

// Delete campground request
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndDelete(req.params.id, function(err, deletedCampground) {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            Comment.deleteMany({ _id: { $in: deletedCampground.comments } }, function(err) {
                if (err) {
                    console.log(err);
                    req.flash("error", err.message);
                    res.redirect("back");
                }
                req.flash("success", "Campground successfully deleted.");
                res.redirect("/campgrounds");
            });
        }
    });
});

module.exports = router;
