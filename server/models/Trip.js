const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },

  title: String,
  from: String,
  to: String,
  days: Number,
  groupSize: Number,

  fullPlan: String,

  // 🔥 NEW: Weather + Date
  weather: String,
  date: String,

  // 🆕 NEW: Day-wise places with images
  placesWithImages: [
    {
      day: String,
      places: [
        {
          name: String,
          image: String
        }
      ]
    }
  ],

  // 🆕 Smart Trip AI Enhancements
  hotels: [
    {
      day: String,
      list: [
        {
          name: String,
          location: String,
          price: Number,
          rating: Number,
          image: String,
          bookUrl: String
        }
      ]
    }
  ],

  transport: [
    {
      leg: String, // e.g. "Day 1: Mumbai to Goa"
      options: [
        {
          type: String,
          departure: String,
          arrival: String,
          duration: String,
          price: Number,
          provider: String,
          bookUrl: String
        }
      ]
    }
  ],

  booking: {
    status: {
      type: String,
      enum: ['available', 'booked', 'pending'],
      default: 'available'
    },
    totalPrice: Number,
    paymentSimulated: Boolean
  },

  isSaved: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Trip", tripSchema);