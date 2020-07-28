const express = require("express"),
  passport = require("passport"),
  User = require("../models/user"),
  router = express.Router();

//========================
//Authentifaction route
//========================
router.get("/", (req, res) => {
  res.render("landing");
});

//register routes
router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  User.register(
    new User({
      username: req.body.username,
      fistName: req.body.firstName,
      lastName: req.body.lastName,
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        req.flash("error", err.message);
        return res.redirect("/register");
      }
      passport.authenticate("local")(req, res, () => {
        req.flash(
          "success",
          "Welcome to the Travellers Handbook " + user.username
        );
        res.redirect("/campgrounds");
      });
    }
  );
});

// login routes
router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
  }),
  (req, res) => {}
);

router.get("/logout", (req, res) => {
  req.flash(
    "success",
    "Goodbye " + req.user.username + " you have been successfully logged out"
  );
  req.logOut();
  res.redirect("/campgrounds");
});

module.exports = router;
