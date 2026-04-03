const Notification = require("../models/notification");

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.userId },
      { isread: true },
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getallnotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const createNotification = async (req, res) => {
  try {
    const { userId, message, isread, role } = req.body;
    const notification = await Notification.create({
      userId,
      message,
      isread,
      role,
    });
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const markAllReadByRole = async (req, res) => {
  try {
    const { role } = req.params;
    await Notification.updateMany({ role: role }, { $set: { isread: true } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getNotifications,
  markAllRead,
  getallnotifications,
  createNotification,
  markAllReadByRole,
};
