import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

export default function Home() {
  const [services, setServices] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/services")
      .then((res) => setServices(res.data))
      .catch(() => setError("Could not load services"));
  }, []);

  const grouped = services.reduce((acc, s) => {
    acc[s.category] = acc[s.category] || [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const labels = {
    mobility: "Mobility Programs",
    senior_wellness: "Senior Wellness Programs",
  };

  return (
    <div>
      <h1>Book a KineticAge Service</h1>

      {error && <p className="error">{error}</p>}

      {Object.keys(grouped).map((category) => (
        <div key={category} className="service-section">
          <h2>{labels[category]}</h2>

          <div className="grid">
            {grouped[category].map((service) => (
              <div key={service._id} className="card">
                <h3>{service.name}</h3>

                <p>{service.description}</p>

                <p className="meta">
                  {service.durationMinutes} min · ₹{service.price}
                </p>

                <Link
                  to={`/book/${service._id}`}
                  className="btn-primary"
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}