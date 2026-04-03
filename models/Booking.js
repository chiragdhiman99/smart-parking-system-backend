const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
  
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    parkingid: { type: String, required: true },
    ownerid: { type: String, required: true },
    userPhone: { type: String },
    slot: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    date: { type: String, required: true },
    fromTime: { type: String, required: true },
    toTime: { type: String },
    amount: { type: String, required: true },
    paymentId: { type: String, required: true },
    paymentStatus: {
      type: String,
      default: "pending",
    },
    bookingStatus: {
      type: String,
      default: "confirmed",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
