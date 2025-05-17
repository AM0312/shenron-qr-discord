import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  userId: String,
  friendCode: String,
});

const User = mongoose.model("User", userSchema);
export default User;
