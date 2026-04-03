const mongoose = require("mongoose");
const pricingGuidelinesSchema = new mongoose.Schema(
  {
    "2-wheeler": {
      hourly: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
      },
      daily: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
      },
    },
    "4-wheeler": {
      hourly: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
      },
      daily: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
      },
    },
  },
  { timestamps: true },
);

const PricingGuidelines = mongoose.model(
  "PricingGuidelines",
  pricingGuidelinesSchema,
);
module.exports = PricingGuidelines;
