const express = require("express");
const router = express.Router();
const Review = require("../models/review");



router.post("/", async (req, res) => {
    try {
        const { userId, userName, parkingId, bookingId, rating, comment } = req.body;
        const review = new Review({ userId, userName, parkingId, bookingId, rating, comment });
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find(); 
    res.json({reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


module.exports = router ;