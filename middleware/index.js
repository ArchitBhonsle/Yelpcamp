const Campground = require("../models/campground"),
    Comment = require("../models/comment.js");

module.exports = {
    checkCampgroundOwnership : function(req, res, next) {
        if (req.isAuthenticated()) {
            Campground.findById(req.params.id, function(err, foundCampground) {
                if (err) {
                    console.log(err);
                    req.flash("error", err.message);
                    res.redirect("back");
                } else {
                    if (foundCampground.author.id.equals(req.user.id)) {
                        next();
                    } else {
                        req.flash("error", "You can't change/delete others' campgrounds");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You need to login to do that");
            res.redirect("/login");
        }
    },
    checkCommentOwnership    : function(req, res, next) {
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if (err) {
                    console.log(err);
                    req.flash("error", err.message);
                    res.redirect("back");
                } else {
                    if (foundComment.author.id.equals(req.user.id)) {
                        next();
                    } else {
                        req.flash("error", "You can't change/delete others' comments");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "You need to login to do that");
            res.redirect("/login");
        }
    },
    isLoggedIn               : function(req, res, next) {
        if (req.isAuthenticated()) return next();
        req.flash("error", "You need to login to do that");
        res.redirect("/login");
    }
};
