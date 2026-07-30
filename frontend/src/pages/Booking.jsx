import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";

export default function Booking() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [paymentType, setPaymentType] = useState("cod");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const loadSlots = () => {
    api
      .get(`/slots?serviceId=${serviceId}`)
      .then((res) => setSlots(res.data))
      .catch(() => setError("Could not load slots"));
  };

  useEffect(loadSlots, [serviceId]);

  const grouped = slots.reduce((acc, s) => {
    acc[s.date] = acc[s.date] || [];
    acc[s.date].push(s);
    return acc;
  }, {});

  const handleConfirm = async () => {
    if (!selectedSlot) {
      setError("Please select a slot first.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/bookings", {
        slotId: selectedSlot,
        paymentType,
      });

      setSuccess("Booking confirmed successfully!");
      setSelectedSlot(null);
      loadSlots();

      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Choose Your Appointment Slot</h1>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {Object.keys(grouped).map((date) => (
        <div key={date} className="slot-day">
          <h3>
            {new Date(date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h3>

          <div className="slot-grid">
            {grouped[date].map((slot) => (
              <button
                key={slot._id}
                disabled={slot.isFull}
                className={`slot-btn ${
                  selectedSlot === slot._id ? "selected" : ""
                } ${slot.isFull ? "full" : ""}`}
                onClick={() => setSelectedSlot(slot._id)}
              >
                <strong>{slot.startTime}</strong>

                <span className="slot-avail">
                  {slot.isFull ? "Full" : `${slot.available} Slots Left`}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="card payment-card">
        <h3>Choose Payment Method</h3>

        <label>
          <input
            type="radio"
            value="prepaid"
            checked={paymentType === "prepaid"}
            onChange={() => setPaymentType("prepaid")}
          />
          Prepaid
        </label>

        <label>
          <input
            type="radio"
            value="cod"
            checked={paymentType === "cod"}
            onChange={() => setPaymentType("cod")}
          />
          Cash on Delivery (COD)
        </label>

        <button
          className="btn-primary"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? "Confirming..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}