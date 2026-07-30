require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Service = require("../models/Service");
const Slot = require("../models/Slot");
const { on } = require("../models/User");

const SERVICES = [
  {
    name: "Senior Wellness Checkup",
    category: "senior_wellness",
    description: "General wellness check-up tailored for senior citizens.",
    durationMinutes: 30,
    price: 500,
  },

  {
    name: "Physiotherapy Session",
    category: "mobility",
    description: "One-on-one mobility and physiotherapy session.",
    durationMinutes: 45,
    price: 800,
  },

  {
    name: "Yoga for Seniors",
    category: "senior_wellness",
    description: "Gentle guided yoga session for seniors.",
    durationMinutes: 60,
    price: 300,
  },

  {
    name: "Mobility Aid Consultation",
    category: "mobility",
    description: "Consultation for walkers, wheelchairs, and mobility aids.",
    durationMinutes: 30,
    price: 400,
  },
];


const TIMES = ["09:00", "11:00", "14:00", "16:00"];

async function seed() {
  await connectDB();

  await Service.deleteMany({});
  await Slot.deleteMany({});

  const createdServices = await Service.insertMany(SERVICES);
  console.log(`Created ${createdServices.length} services`);

  const slotsToCreate = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];

    for (const service of createdServices) {
      for (const time of TIMES) {
        slotsToCreate.push({
          service: service._id,
          date: dateStr,
          startTime: time,
          capacity: 5,
          bookedCount: 0,
        });
      }
    }
  }

  await Slot.insertMany(slotsToCreate);
  console.log(`Created ${slotsToCreate.length} slots for the next 3 days`);

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
