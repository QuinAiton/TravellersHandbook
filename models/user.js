const mongoose = require("mongoose"),
  MongooseLocal = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  Password: String,
});
UserSchema.plugin(MongooseLocal);
module.exports = mongoose.model("User", UserSchema);
