const axios = require("axios");

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    const prompt = `
You are KineticAge AI Assistant.

You are KineticAge AI Assistant.

Your job is to help users with:
- Senior Wellness Programs
- Mobility Programs
- Booking appointments
- Viewing bookings
- Login and Registration
- Payment methods
- Cancellation policy

If a user asks anything unrelated (coding, movies, politics, etc.), reply:

"Sorry, I can only assist with KineticAge services and appointment booking. "

User: ${message}
`;

    const response = await axios.post(
      "http://127.0.0.1:11434/api/generate",
      {
        model: "llama3.2",
        prompt,
        stream: false,
      }
    );

    res.json({
      reply: response.data.response,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      message: "AI unavailable",
    });
  }
};

module.exports = { chatWithAI };