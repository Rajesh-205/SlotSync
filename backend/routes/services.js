const express = require("express");
const Service = require("../models/Service");

const router = express.Router();

// GET /api/services - list all services (senior wellness + mobility programs)
router.get("/", async (req, res) => {
  try {
    const services = await Service.find().sort({ category: 1, name: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
