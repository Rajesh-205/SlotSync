const mongoose = require("mongoose");

// Each slot belongs to a service, on a specific date/time, with limited capacity.
const slotSchema = new mongoose.Schema(
  {
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    startTime: { type: String, required: true }, // HH:mm
    capacity: { type: Number, default: 5 },
    bookedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Prevent duplicate slot definitions for the same service/date/time
slotSchema.index({ service: 1, date: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model("Slot", slotSchema);
