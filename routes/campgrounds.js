const express = require("express"),
  router = express.Router(),
  Campground = require("../models/campground"),
  Comment = require("../models/comment"),
  middleware = require("../middleware"),
  NodeGeocoder = require("node-geocoder");

const options = {
  provider: "google",
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

const geocoder = NodeGeocoder(options);

//index route show all
router.get("/", (req, res) => {
  //add fuzzy search for campgrounds
  var noMatch = null;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    // Get all campgrounds from DB
    Campground.find({ name: regex }, function (err, allCampgrounds) {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/index", {
          campgrounds: allCampgrounds,
        });
      }
    });
  } else {
    //searches database and finds all the  and renders them to  page
    Campground.find({}, (err, allCampgrounds) => {
      err
        ? console.log(err)
        : res.render("campgrounds/index", { campgrounds: allCampgrounds });
    });
  }
});
//=====================
//Create new campground
//=====================
//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

//====================================================
//create  - add new  to database
//====================================================

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
  // get data from form and add to campgrounds array
  const name = req.body.name;
  const image = req.body.image;
  const desc = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username,
  };
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      console.log(err);
      req.flash("error", "Invalid address");
      return res.redirect("back");
    }
    const lat = data[0].latitude;
    const lng = data[0].longitude;
    const location = data[0].formattedAddress;
    const newCampground = {
      name: name,
      image: image,
      description: desc,
      author: author,
      location: location,
      lat: lat,
      lng: lng,
    };
    // Create a new campground and save to DB
    Campground.create(newCampground, function (err, newlyCreated) {
      if (err) {
        console.log(err);
      } else {
        //redirect back to campgrounds page
        console.log(newlyCreated);
        res.redirect("/campgrounds");
      }
    });
  });
});

//================
//Show info of Campground
//================
//when using id: (wildcard) must be used after new or it will tread new as id route
router.get("/:id", (req, res) => {
  //find campground with provided ID
  Campground.findById(req.params.id)
    .populate("comments")
    .exec((err, foundCampground) => {
      if (err || !foundCampground) {
        req.flash("error", "campground not found");
        res.redirect("back");
      } else {
        res.render("campgrounds/show", { campground: foundCampground });
      }
    });
});

//Edit Campground Routes
//select campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
  //middle ware so only authors can edit their own posts
  Campground.findById(req.params.id, (err, foundCampground) => {
    res.render("campgrounds/edit", { campground: foundCampground });
  });
});

//update campground
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash("error", "Invalid address");
      return res.redirect("back");
    }
    req.body.campground.lat = data[0].latitude;
    req.body.campground.lng = data[0].longitude;
    req.body.campground.location = data[0].formattedAddress;

    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (
      err,
      campground
    ) {
      if (err) {
        req.flash("error", err.message);
        res.redirect("back");
      } else {
        req.flash("success", "Successfully Updated!");
        res.redirect("/campgrounds/" + campground._id);
      }
    });
  });
});
//destroy campground
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      console.log("/campgrounds");
    } else {
      req.flash("success", "Campground successfully removed");
      res.redirect("/campgrounds");
    }
  });
});

//function for fuzzy search
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
