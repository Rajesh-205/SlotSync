const express = require("express");
const mongoose = require("mongoose");
const Slot = require("../models/Slot");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /api/bookings - create a booking (auth required)
// Data integrity: the slot's bookedCount is incremented via a single atomic
// findOneAndUpdate with a condition (bookedCount < capacity). MongoDB
// guarantees single-document writes are atomic, so two simultaneous requests
// can never both succeed in overbooking the same slot (no double-booking,
// no lost updates). If the booking record fails to save after the slot is
// reserved, we roll back the increment so the two stay consistent.
router.post("/", auth, async (req, res) => {
  const { slotId, paymentType } = req.body;

  if (!slotId || !["prepaid", "cod"].includes(paymentType)) {
    return res.status(400).json({ message: "slotId and a valid paymentType (prepaid|cod) are required" });
  }

  let reservedSlot = null;

  try {
    // Atomically reserve one seat on the slot, only if capacity allows it.
    reservedSlot = await Slot.findOneAndUpdate(
      { _id: slotId, $expr: { $lt: ["$bookedCount", "$capacity"] } },
      { $inc: { bookedCount: 1 } },
      { new: true }
    );

    if (!reservedSlot) {
      return res.status(409).json({ message: "This slot is no longer available" });
    }

    const service = await Service.findById(reservedSlot.service);
    if (!service) {
      // Roll back the reservation since the service no longer exists.
      await Slot.findByIdAndUpdate(slotId, { $inc: { bookedCount: -1 } });
      return res.status(404).json({ message: "Service not found" });
    }

    const booking = await Booking.create({
      user: req.userId,
      service: service._id,
      slot: reservedSlot._id,
      date: reservedSlot.date,
      startTime: reservedSlot.startTime,
      paymentType,
      paymentStatus: paymentType === "prepaid" ? "paid" : "pending",
      amount: service.price,
    });

    res.status(201).json(booking);
  } catch (err) {
    // If we already reserved a seat but booking creation failed, release it.
    if (reservedSlot) {
      await Slot.findByIdAndUpdate(slotId, { $inc: { bookedCount: -1 } });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/bookings/me - dashboard: past + upcoming bookings for logged-in user
router.get("/me", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate("service", "name category price")
      .sort({ date: 1, startTime: 1 });

    const today = new Date().toISOString().split("T")[0];
    const upcoming = bookings.filter((b) => b.date >= today && b.status === "confirmed");
    const past = bookings.filter((b) => b.date < today || b.status === "cancelled");

    res.json({ upcoming, past });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PATCH /api/bookings/:id/cancel - cancel a booking and free up the slot
router.patch("/:id/cancel", auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.userId });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    await Slot.findByIdAndUpdate(booking.slot, { $inc: { bookedCount: -1 } });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
