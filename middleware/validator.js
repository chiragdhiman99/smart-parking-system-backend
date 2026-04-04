const { body, validationResult } = require("express-validator");

const loginValidator = [
  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required").trim(),
];

const signupValidator = [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .trim()
    .escape(),

  body("email").isEmail().withMessage("Valid email required").normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .trim(),

  body("role").notEmpty().withMessage("Role is required").trim().escape(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { loginValidator, signupValidator, validate };
