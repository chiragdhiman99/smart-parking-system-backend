const express = require("express");
const router = express.Router();

const {
  getparking,
  createparking,
  getparkingbyid,
  getparkingbyid2,
  updateparking,
  deleteparking,
  updateparking2,
} = require("../controllers/parkingController");

router.get("/", getparking);
router.get("/owner/:ownerId", getparkingbyid);
router.get("/:parkingId", getparkingbyid2);
router.post("/", createparking);
router.put("/:parkingId", updateparking);
router.delete("/:parkingId", deleteparking);
router.put("/update/:parkingId", updateparking2);

module.exports = router;
