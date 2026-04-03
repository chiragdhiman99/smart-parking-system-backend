const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();
const notification = require("../models/notification");
const { io } = require("../server");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/verify", (req, res,next) => {

  try{
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

 if (expectedSignature === razorpay_signature) {
    const userid = req.body.userId;
    const username = req.body.username;
    const ownerid = req.body.ownerId;
    const slotnumber = req.body.slotnumber;
    const parkingname = req.body.parkingname;
    const date = req.body.date;
    const time = req.body.time;
    const amount = req.body.amount;

    const message = `🎉 Booking Confirmed! Slot ${slotnumber} at ${parkingname} booked for ${date} from ${time}. Total paid: ${amount}`;

  const ownerMessage = `💰 New Booking! Slot ${slotnumber} booked by ${username}. You earned ${amount}!`;


     notification.create({
      userId: userid,
      role: "user",
      message: message,
      isread: false,
    });

    io.to(userid).emit("notification", message);

    notification.create({
      userId: ownerid,
      role: "owner",
      message: ownerMessage,
      isread: false,
    });

    
    io.to(ownerid).emit("notification", ownerMessage);
    res.json({ success: true, message: "Payment verified!" });
} else {
    res.status(400).json({ success: false, message: "Invalid signature!" });
}
  }catch(err){
    next(err);
  }

});

module.exports = router;
