const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  userId: String,
  friendCode: String,
});

module.exports = mongoose.model("User", userSchema);
