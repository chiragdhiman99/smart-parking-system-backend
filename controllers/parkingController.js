const Parking = require("../models/Parking");
const Notification = require("../models/notification");

const getparking = async (req, res) => {
  try {
    const parkings = await Parking.find();
    res.status(200).json(parkings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getparkingbyid = async (req, res) => {
  try {
    const parking = await Parking.find({ ownerId: req.params.ownerId });
    if (!parking || parking.length === 0) {
      return res.status(404).json({ message: "Parking not found" });
    }
    res.status(200).json(parking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateSlots = (totalSlots) => {
  const slots = [];
  const rows = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const perRow = 5;
  for (let i = 0; i < totalSlots; i++) {
    const rowIndex = Math.floor(i / perRow);
    const colIndex = (i % perRow) + 1;
    slots.push({
      id: i + 1,
      label: `${rows[rowIndex]}${colIndex}`,
      status: "available",
    });
  }
  return slots;
};

const createparking = async (req, res) => {
  try {
    const slots = generateSlots(req.body.totalSlots);
    const newParking = new Parking({ ...req.body, slots });
    const savedParking = await newParking.save();

    await Notification.create({
      userId: savedParking.ownerId,
      role: "admin",
      message: `🏠 New Parking Request: "${savedParking.name}" has been submitted for approval. Please review and take action.`,
      isread: false,
    });

    res.status(201).json(savedParking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getparkingbyid2 = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.parkingId);
    if (!parking) {
      return res.status(404).json({ message: "Parking not found" });
    }
    res.status(200).json(parking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateparking = async (req, res) => {
  try {
    const updatedParking = await Parking.findByIdAndUpdate(
      req.params.parkingId,
      req.body,
      { new: true },
    );
    if (!updatedParking) {
      return res.status(404).json({ message: "Parking not found" });
    }
    res.status(200).json(updatedParking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteparking = async (req, res) => {
  try {
    const deletedParking = await Parking.findByIdAndDelete(
      req.params.parkingId,
    );
    if (!deletedParking) {
      return res.status(404).json({ message: "Parking not found" });
    }
    res.status(200).json({ message: "Parking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateparking2 = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.parkingId);
    if (!parking) {
      return res.status(404).json({ message: "Parking not found" });
    }
    const updatedParking = await Parking.findByIdAndUpdate(
      req.params.parkingId,
      req.body,
      { new: true },
    );

      if (req.body.status === "approved") {
      await Notification.create({
        userId: updatedParking.ownerId,
        role: "owner",
        message: `✅ Parking Approved: "${updatedParking.name}" has been approved by admin. You can now receive bookings!`,
        isread: false,
      });
    } else if (req.body.status === "rejected") {
      await Notification.create({
        userId: updatedParking.ownerId,
        role: "owner",
        message: `❌ Parking Rejected: "${updatedParking.name}" has been rejected by admin. Reason: ${req.body.reason || "Does not meet listing requirements."}`,
        isread: false,
      });
    }
    res.status(200).json(updatedParking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getparking,
  createparking,
  getparkingbyid,
  getparkingbyid2,
  updateparking,
  deleteparking,
  updateparking2,
};
