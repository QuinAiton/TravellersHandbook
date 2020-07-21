const campground = require("../models/campground");

const express = require("express"),
  Campground = require("../models/campground"),
  Comment = require("../models/comment"),
  middlware = require("../middleware"),
  router = express.Router();

//index route show all
router.get("/", (req, res) => {
  //searches database and finds all the  and renders them to  page
  Campground.find({}, (err, allCampgrounds) => {
    err
      ? console.log(err)
      : res.render("campgrounds/index", { campgrounds: allCampgrounds });
  });
});

//====================================================
//create  - add new  to database
//====================================================
router.post("/", middlware.isLoggedIn, (req, res) => {
  //must use req.body to get data from the form
  const name = req.body.name,
    image = req.body.image,
    desc = req.body.description,
    author = {
      id: req.user._id,
      username: req.user.username,
    },
    newCampground = {
      name: name,
      image: image,
      description: desc,
      author: author,
    };
  //create new campground and save to database
  Campground.create(newCampground, (err, newlyCreated) => {
    err ? console.log(err) : res.redirect("/campgrounds");
  });
});

//=====================
//Create new campground
//=====================
//NEW - show form to create new campground
router.get("/new", middlware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

//================
//Show Campground
//================
//when using id: (wildcard) must be used after new or it will tread new as id route
router.get("/:id", (req, res) => {
  //find campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      err
        ? console.log(err)
        : res.render("campgrounds/show", { campground: foundCampground });
    });
});

//Edit Campground Routes
//select campground
router.get("/:id/edit", middlware.checkCampgroundOwnership, (req, res) => {
  //middle ware so only authors can edit their own posts
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

//update campground
router.put("/:id", middlware.checkCampgroundOwnership, (req, res) => {
  //   req.body.campground.body = req.sanitize(req.body.campground.body);
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (err, updDtedCampground) => {
      err ? console.log(err) : res.redirect("/campgrounds/" + req.params.id);
    }
  );
});

//destroy campground
router.delete("/:id", middlware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log(err);
    }
    Comment.deleteMany({ _id: { $in: campgroundRemoved.Comments } }, (err) => {
      err ? console.log(err) : res.redirect("/campgrounds");
    });
  });
});

module.exports = router;
