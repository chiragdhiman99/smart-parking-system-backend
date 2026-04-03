const Parking = require("../models/Parking");
const Booking = require("../models/Booking");
const { sendCancellationEmail } = require("../utils/sendemail");
const cancelBooking = async (req, res) => {
      

  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.bookingStatus = "cancelled";
    await booking.save();

    await Parking.updateOne(
      { _id: booking.parkingid, "slots.name": booking.slot },
      { $set: { "slots.$.status": "available" } },
    );
    await sendCancellationEmail(booking.userEmail, booking.userName, booking);

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
