const mongoose = require("mongoose");

const grpMsgSchama = new mongoose.Schema({
  grpId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  sender: {
    type: String,
  },
  message: {
    type: String,
  },
});

module.exports = mongoose.model("grpMsg", grpMsgSchama);
