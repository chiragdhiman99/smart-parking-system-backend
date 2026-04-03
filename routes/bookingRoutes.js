const express = require("express");
const router = express.Router();
const userauthmiddleware = require("../middleware/authMiddleware");
const {
  createbooking,
  getbookings,
  getBookingsByOwner,
  getbookingbyparkingid,
  cancelBooking,
  getallbookings,
} = require("../controllers/bookingController");

router.post("/create/booking", createbooking);
router.get("/get/booking", getbookings);
router.get("/parking/:parkingid", getbookingbyparkingid);
router.put("/cancel/:bookingId", cancelBooking);
router.get("/:ownerId", getBookingsByOwner);
router.get("/get/bookingsss", getallbookings);

router.get("/check/auth",userauthmiddleware, (req, res) => {
  res.status(200).json({ message: "Authenticated" });
});

module.exports = router;
