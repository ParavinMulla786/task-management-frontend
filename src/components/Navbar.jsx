import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { theme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isDark = theme === "dark";

  return (
    <nav
      className={`navbar navbar-expand-lg px-4 py-3 border-bottom shadow-sm ${
        isDark ? "navbar-dark bg-dark" : "navbar-light bg-white"
      }`}
    >
      <div className="container-fluid">

        {/* LEFT SIDE - TITLE */}
        <div className="d-flex flex-column">
          <h4 className="fw-bold mb-0">
            📋 Task Management
          </h4>

          <small className={isDark ? "text-light" : "text-muted"}>
            Welcome, {user?.name || "User"}
          </small>
        </div>

        {/* CENTER / THEME */}
        <div className="ms-auto me-3">
          <ThemeToggle />
        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div className="d-flex align-items-center gap-2">

          <button
            className={`btn ${
              isDark ? "btn-outline-light" : "btn-outline-primary"
            }`}
            onClick={() => navigate("/profile")}
          >
            👤 Profile
          </button>

          <button
            className="btn btn-danger"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>

      </div>
    </nav>
  );
}