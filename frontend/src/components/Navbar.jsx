import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand">
          Slot<span className="brand-accent">Sync</span>
        </Link>

        <div className="nav-links">
          {user ? (
            <>
              <Link to="/dashboard">My Bookings</Link>

              <span className="nav-user">
                Hi, {user.name}
              </span>

              <button onClick={handleLogout} className="btn-link">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}