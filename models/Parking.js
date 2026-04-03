const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  id: Number,
  label: String,
  status: { type: String, default: "available" },
});

const parkingSchema = new mongoose.Schema(
  {
    slots: [slotSchema],
    blockeddates: [{ type: [String], default: [] }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { strict: false },
);

module.exports = mongoose.model("Parking", parkingSchema);
