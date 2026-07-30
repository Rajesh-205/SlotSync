import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function Dashboard() {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    api
      .get("/bookings/me")
      .then((res) => {
        setUpcoming(res.data.upcoming);
        setPast(res.data.past);
      })
      .catch(() => setError("Could not load bookings"));
  };

  useEffect(load, []);

  const handleCancel = async (id) => {
    try {
      await api.patch(`/bookings/${id}/cancel`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Cancel failed");
    }
  };

  const BookingRow = ({ b, cancellable }) => (
    <div className="card booking-row">
      <div>
        <strong>{b.service?.name}</strong>
        <p className="meta">{b.date} at {b.startTime}</p>
        <p className="meta">
          {b.paymentType.toUpperCase()} &middot; ₹{b.amount} &middot; {b.paymentStatus}
        </p>
        <span className={`badge ${b.status}`}>{b.status}</span>
      </div>
      {cancellable && b.status === "confirmed" && (
        <button className="btn-link" onClick={() => handleCancel(b._id)}>
          Cancel
        </button>
      )}
    </div>
  );

  return (
    <div>
      <h1>My Bookings</h1>
      {error && <p className="error">{error}</p>}

      <h2>Upcoming</h2>
      {upcoming.length === 0 && <p>No upcoming bookings.</p>}
      {upcoming.map((b) => (
        <BookingRow key={b._id} b={b} cancellable />
      ))}

      <h2>Past</h2>
      {past.length === 0 && <p>No past bookings.</p>}
      {past.map((b) => (
        <BookingRow key={b._id} b={b} cancellable={false} />
      ))}
    </div>
  );
}
