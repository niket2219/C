const mongoose = require("mongoose");

const otpSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    expiresIn: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("otps", otpSchema);
