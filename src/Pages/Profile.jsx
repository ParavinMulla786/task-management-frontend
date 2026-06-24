import { useEffect, useState } from "react";
import { getUserInfo } from "../services/userService";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const res = await getUserInfo();

      console.log("PROFILE API RESPONSE:", res.data);

      const userData = res?.data?.data;

      setUser(userData || null);
    } catch (error) {
      console.log(
        "Profile Error:",
        error?.response?.data || error.message
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <h5>👤 Loading Profile...</h5>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger shadow-sm">
          Profile not found or unauthorized access.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">

      <div className="card border-0 shadow-sm p-4">

        {/* HEADER */}
        <div className="d-flex align-items-center mb-4">

          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
            style={{
              width: "60px",
              height: "60px",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div className="ms-3">
            <h4 className="mb-0">{user.name}</h4>
            <span className="badge bg-dark">
              {user.role}
            </span>
          </div>

        </div>

        <hr />

        {/* DETAILS */}
        <div className="row">

          <div className="col-md-6 mb-3">
            <label className="text-muted">
              Email
            </label>
            <p className="fw-semibold">
              {user.email}
            </p>
          </div>

          <div className="col-md-6 mb-3">
            <label className="text-muted">
              Contact Number
            </label>
            <p className="fw-semibold">
              {user.contactNumber || "N/A"}
            </p>
          </div>

          <div className="col-md-6 mb-3">
            <label className="text-muted">
              Role
            </label>
            <p className="fw-semibold">
              {user.role}
            </p>
          </div>

          <div className="col-md-6 mb-3">
            <label className="text-muted">
              User ID
            </label>
            <p className="fw-semibold">
              #{user.id}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}