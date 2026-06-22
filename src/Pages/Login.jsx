import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
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

      const res = await loginUser(form);

      if (res.data.token) {
        navigate("/");
      } else {
        setError("Invalid login response");
      }

    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">

      <div className="col-md-4">

        {/* CARD */}
        <div className="card shadow-lg border-0 rounded-4">

          <div className="card-body p-4">

            {/* TITLE */}
            <h3 className="text-center mb-3">🔐 Login</h3>
            <p className="text-center text-muted mb-4">
              Welcome back! Please enter your details.
            </p>

            {/* ERROR */}
            {error && (
              <div className="alert alert-danger py-2">
                {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit}>

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
                  placeholder="Enter password"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* BUTTON */}
              <button
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </form>

            {/* FOOTER */}
            <div className="text-center mt-3">
              <small>
                Don't have an account? <a href="/register">Register</a>
              </small>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}