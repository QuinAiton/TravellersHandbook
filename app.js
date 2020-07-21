const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Campground = require("./models/campground"),
  seedDB = require("./seeds"),
  Comment = require("./models/comment"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  MongooseLocal = require("passport-local-mongoose"),
  User = require("./models/user"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer");

const CommentRoutes = require("./routes/comments"),
  AuthentifactionRoutes = require("./routes/authentification"),
  CampgroundRoutes = require("./routes/campgrounds");

const middlware = require("./middleware");

mongoose.set("useFindAndModify", false);

// User = require("./models/user");
mongoose.connect("mongodb://localhost:27017/TravellerHandBook", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/css"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
// seedDB();

//==========================
//PASSPORT CONFIG
//==========================
app.use(
  require("express-session")({
    secret: "there is a secret message here",
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
  next();
});
app.use("/campgrounds", CampgroundRoutes);
app.use("/campgrounds/:id/comments", CommentRoutes);
app.use(AuthentifactionRoutes);

router.get("/", (req, res) => {
  res.render("landing");
});
app.listen(3000, () => {
  console.log(" YelpCamp server launching on port 3000!...");
});
