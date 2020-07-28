//=========================================================================
//requiring packages and models
//=========================================================================
require("dotenv").config();
const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  MongooseLocal = require("passport-local-mongoose"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer"),
  flash = require("connect-flash"),
  User = require("./models/user"),
  Campground = require("./models/campground"),
  seedDB = require("./seeds"),
  Comment = require("./models/comment"),
  middlware = require("./middleware");

//========================================================================
// requiring routes
//========================================================================
const CommentRoutes = require("./routes/comments"),
  indexRoutes = require("./routes/index"),
  CampgroundRoutes = require("./routes/campgrounds");

//connect to mongoose database
mongoose.connect("mongodb://localhost:27017/TravellerHandBook", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useFindAndModify", false);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public/"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//==========================
//PASSPORT CONFIG
//==========================
app.use(
  require("express-session")({
    secret: "this is the Keyword",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//calls req.user on every route allowing us to access user information
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/campgrounds", CampgroundRoutes);
app.use("/campgrounds/:id/comments", CommentRoutes);
app.use(indexRoutes);

app.listen(3000, () => {
  console.log(" YelpCamp server launching on port 3000!...");
});
