const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
    default: "",
  },
  resetTokenExpiration: {
    type: Date,
    default: null,
  },
});
module.exports = mongoose.model("User", usersSchema);
