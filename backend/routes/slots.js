const express = require("express");
const Slot = require("../models/Slot");

const router = express.Router();

// GET /api/slots?serviceId=xxx&date=YYYY-MM-DD
// If no date given, returns slots for the next 3 days for that service.
router.get("/", async (req, res) => {
  try {
    const { serviceId, date } = req.query;
    if (!serviceId) return res.status(400).json({ message: "serviceId is required" });

    const filter = { service: serviceId };

    if (date) {
      filter.date = date;
    } else {
      const dates = [];
      for (let i = 0; i < 3; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        dates.push(d.toISOString().split("T")[0]);
      }
      filter.date = { $in: dates };
    }

    const slots = await Slot.find(filter).sort({ date: 1, startTime: 1 });
    const withAvailability = slots.map((s) => ({
      _id: s._id,
      service: s.service,
      date: s.date,
      startTime: s.startTime,
      capacity: s.capacity,
      bookedCount: s.bookedCount,
      available: s.capacity - s.bookedCount,
      isFull: s.bookedCount >= s.capacity,
    }));

    res.json(withAvailability);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
