const express = require("express");
const router = express.Router();
const User = require("../models/User");
const loginLimiter = require("../middleware/ratelimiter");
const {
  loginValidator,
  signupValidator,
  validate,
} = require("../middleware/validator");

const {
  signup,
  login,
  getuser,
  putuser,
  getallusers,
} = require("../controllers/authController");
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.post("/signup", signupValidator, signup);
router.post("/login", loginLimiter, loginValidator, login);
router.get("/user/:userId", getuser);
router.put("/user/:userId", putuser);

router.get("/users", getallusers);

router.get("/google", (req, res, next) => {
  const role = req.query.role;
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: role,
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async (req, res) => {
    const role = req.query.state || "driver";

    if (!req.user.role) {
      req.user.role = role;
      await req.user.save();
    }

    const finalRole = req.user.role;

    const token = jwt.sign(
      { userId: req.user._id, role: finalRole },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.redirect(
      `http://localhost:5173/${finalRole}/dashboard?token=${token}&role=${finalRole}`,
    );
  },
);

router.put("/user/:userId/status", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.userId,
      { status: req.body.status },
      { new: true },
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
