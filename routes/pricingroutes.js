const express = require("express");
const router = express.Router();
const PricingGuidelines = require("../models/guidelines");

router.get("/", async (req, res) => {
  try {
    const guidelines = await PricingGuidelines.find();
    res.json(guidelines);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const guidelines = await PricingGuidelines.findOneAndUpdate({}, req.body, {
      upsert: true,
      new: true,
    });
    res.json(guidelines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
