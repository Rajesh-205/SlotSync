const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    slot: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    paymentType: { type: String, enum: ["prepaid", "cod"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
