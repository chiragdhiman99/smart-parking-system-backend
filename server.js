const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const passport = require("./config/passport");
const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");
const Booking = require("./models/Booking");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const errormiddleware = require("./middleware/errorMiddleware");
const pricingRoutes = require("./routes/pricingroutes");
const {
  sendBookingConfirmation,
  sendThankYouEmail,
} = require("./utils/sendemail");
const Parking = require("./models/Parking");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

connectDB();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

module.exports = { io };

app.use(async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return next();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (user?.status === "banned") {
      return res
        .status(403)
        .json({ message: "Your account has been suspended." });
    }
    next();
  } catch (err) {
    next();
  }
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/parkings", require("./routes/parkingRoutes"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/notifications", require("./routes/notificationroutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/admin", require("./routes/adminroutes"));
app.use("/api/pricing", pricingRoutes);

app.post("/confirm-booking", async (req, res) => {
  const { username, email, slot, date, fromTime, amount, vehicleNumber } =
    req.body;
  await sendBookingConfirmation(email, username, {
    slot,
    date,
    fromTime,
    amount,
    vehicleNumber,
  });
  res.json({ success: true, message: "Email sent!" });
});

app.use(errormiddleware);
io.on("connection", (socket) => {
  socket.on("joinRoom", (userid) => {
    socket.join(userid);
  });
});

cron.schedule("* * * * *", async () => {
  try {
    const date = new Date();
    const confirmbooking = await Booking.find({
      bookingStatus: "confirmed",
    });

    for (const booking of confirmbooking) {
      const bookingEndTime = new Date(
        `${booking.date}T${booking.toTime}:00+05:30`,
      );

      if (bookingEndTime <= date) {
        await Booking.findByIdAndUpdate(booking._id, {
          bookingStatus: "completed",
        });

        await Parking.findOneAndUpdate(
          { _id: booking.parkingid, "slots.label": booking.slot },
          {
            $set: { "slots.$.status": "available" },
            $inc: { availableSlots: 1 },
          },
        );

        await sendThankYouEmail(booking.userEmail, booking.userName, {
          slot: booking.slot,
          date: booking.date,
          fromTime: booking.fromTime,
          toTime: booking.toTime,
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
});
server.listen(port, () => {});
