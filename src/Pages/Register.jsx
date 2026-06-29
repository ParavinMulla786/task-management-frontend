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

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle Text Inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Image
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle Register
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("contactNumber", form.contactNumber);

      // Field name must match uploadImage.single("ImgPath")
      formData.append("image", image);

      await registerUser(formData);

      navigate("/login");

    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.msg || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">

      <div className="col-md-5">

        <div className="card shadow-lg border-0 rounded-4">

          <div className="card-body p-4">

            <h3 className="text-center mb-2">
              📝 Register
            </h3>

            <p className="text-center text-muted mb-4">
              Create your account
            </p>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Name */}
              <div className="mb-3">
                <label className="form-label">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Contact */}
              <div className="mb-3">
                <label className="form-label">
                  Contact Number
                </label>

                <input
                  type="text"
                  name="contactNumber"
                  className="form-control"
                  placeholder="Enter Contact Number"
                  value={form.contactNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Profile Picture */}
              <div className="mb-3">
                <label className="form-label">
                  Profile Picture
                </label>

                <input
  type="file"
  className="form-control"
  accept="image/*"
  onChange={handleImageChange}
/>
              </div>

              {/* Image Preview */}
              {image && (
                <div className="text-center mb-3">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="rounded-circle border"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}

              {/* Register Button */}
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Register"}
              </button>

            </form>

            <div className="text-center mt-3">
              <small>
                Already have an account?{" "}
                <a href="/login">Login</a>
              </small>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}