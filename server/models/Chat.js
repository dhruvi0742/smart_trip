const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  },

  chatId: {   // ✅ ADDED
    type: String
  },

  role: {
    type: String,
    required: true
  },

  message: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Chat", chatSchema);