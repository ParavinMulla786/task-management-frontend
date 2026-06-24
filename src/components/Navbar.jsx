import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm px-4 py-3 border-bottom">
      <div className="container-fluid">

        {/* Logo / Title */}
        <div>
          <h4 className="fw-bold mb-0 text-primary">
            📋 Task Management
          </h4>
          <small className="text-muted">
            Welcome, {user?.name || "User"}
          </small>
        </div>

        {/* Right Side */}
        <div className="d-flex align-items-center gap-2">

          <button
            className="btn btn-outline-primary"
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