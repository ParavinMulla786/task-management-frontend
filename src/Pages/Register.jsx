import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await registerUser(form);

      navigate("/login");

    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">

      <div className="col-md-5">

        {/* CARD */}
        <div className="card shadow-lg border-0 rounded-4">

          <div className="card-body p-4">

            {/* TITLE */}
            <h3 className="text-center mb-2">📝 Register</h3>
            <p className="text-center text-muted mb-4">
              Create your account to continue
            </p>

            {/* ERROR */}
            {error && (
              <div className="alert alert-danger py-2">
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit}>

              {/* NAME */}
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  className="form-control"
                  placeholder="Enter your name"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Create password"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* CONTACT */}
              <div className="mb-3">
                <label className="form-label">Contact Number</label>
                <input
                  name="contactNumber"
                  className="form-control"
                  placeholder="Enter contact number"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* BUTTON */}
              <button
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Register"}
              </button>

            </form>

            {/* FOOTER */}
            <div className="text-center mt-3">
              <small>
                Already have an account? <a href="/login">Login</a>
              </small>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}