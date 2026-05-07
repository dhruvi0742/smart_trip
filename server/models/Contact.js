
const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },

  message: {
    type: String,
    required: true
  },

  adminReply: {
    type: String,
    default: ""
  },

  isReadByUser: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Contact", ContactSchema);


