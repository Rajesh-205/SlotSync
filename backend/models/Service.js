const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["mobility", "senior_wellness"],
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    durationMinutes: {
      type: Number,
      default: 30,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);