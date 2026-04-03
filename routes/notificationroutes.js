const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAllRead,
  getallnotifications,
  createNotification,
  markAllReadByRole
} = require("../controllers/notificationcontroller");
const { getallbookings } = require("../controllers/bookingController");

router.post("/", createNotification);
router.get("/:userId", getNotifications);
router.put("/read/:userId", markAllRead);
router.get("/", getallnotifications);
router.put("/read/role/:role", markAllReadByRole);


module.exports = router;
