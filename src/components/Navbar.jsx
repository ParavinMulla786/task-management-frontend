import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-between align-items-center p-3 bg-white border-bottom">

      <h5 className="mb-0">Task Dashboard</h5>

      <div className="d-flex align-items-center gap-3">

        {/* PROFILE ICON */}
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => navigate("/profile")}
        >
          👤 Profile
        </button>

        {/* LOGOUT */}
        <button
          className="btn btn-outline-danger btn-sm"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>

      </div>
    </div>
  );
}