const express = require("express"),
  Campground = require("../models/campground"),
  Comment = require("../models/comment"),
  middleware = require("../middleware");
(methodOverride = require("method-override")),
  (router = express.Router({ mergeParams: true }));

//======================
//Comment routes
//=======================
router.get("/new", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    err
      ? console.log(err)
      : res.render("comments/new", { campground: campground });
  });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if (err) {
      console.log(err);
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if (err) {
          console.log(err);
        } else {
          //add username and ID to comments
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});
//======================
//edit comment routes
//=======================
router.get(
  "/:comment_id/edit",
  middleware.checkCommentOwnership,
  (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      err
        ? res.redirect("back")
        : res.render("comments/edit", {
            campground_id: req.params.id,
            comment: foundComment,
          });
    });
  }
);

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, updatedComment) => {
      err
        ? res.redirect("back")
        : res.redirect("/campgrounds/" + req.params.id);
    }
  );
});
//=================
//delete route
//=================
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    err ? res.redirect("back") : res.redirect("/campgrounds/" + req.params.id);
  });
});

module.exports = router;
