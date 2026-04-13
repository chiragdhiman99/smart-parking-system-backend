const booking = require("../models/Booking");
const Parking = require("../models/Parking");
const {
  sendCancellationEmail,
  sendBookingConfirmation,
} = require("../utils/sendemail");
const createbooking = async (req, res) => {
  try {
    const newbooking = new booking(req.body);
    const savedbooking = await newbooking.save();
    res.status(200).json(savedbooking);

    try {
      await sendBookingConfirmation(
        savedbooking.userEmail,
        savedbooking.userName,
        savedbooking,
      );
    } catch (emailError) {
      console.log("❌ Booking email error:", emailError.message);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
const getbookings = async (req, res) => {
  try {
    const email = req.query.userEmail;
    const bookings = await booking.find({ userEmail: email });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getbookingbyparkingid = async (req, res) => {
  try {
    const bookings = await booking.find({ parkingid: req.params.parkingid });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json(err);
  }
};
const getBookingsByOwner = async (req, res) => {
  try {
    const bookings = await booking.find({ ownerid: req.params.ownerId });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const foundBooking = await booking.findById(bookingId);
    if (!foundBooking)
      return res.status(404).json({ message: "Booking not found" });

    foundBooking.bookingStatus = "cancelled";
    await foundBooking.save();

    await Parking.updateOne(
      { _id: foundBooking.parkingid, "slots.name": foundBooking.slot },
      { $set: { "slots.$.status": "available" } },
    );
    res.status(200).json({ message: "Booking cancelled successfully" });

    try {
      await sendCancellationEmail(
        foundBooking.userEmail,
        foundBooking.userName,
        foundBooking,
      );
    } catch (emailError) {}
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getallbookings = async (req, res) => {
  try {
    const bookings = await booking.find();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createbooking,
  getbookings,
  getbookingbyparkingid,
  getBookingsByOwner,
  cancelBooking,
  getallbookings,
};
