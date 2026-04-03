const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  parkingId: { type: String, required: true },
  bookingId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: "" },
  role: { type: String, default: "driver" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);
