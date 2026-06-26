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

      console.log("Profile Response:", res.data);

      setUser(res.data.data);
    } catch (error) {
      console.log("Profile Error:", error.response?.data || error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading Profile...</h4>
      </div>
    );
  }

  // User Not Found
  if (!user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          User Not Found
        </div>
      </div>
    );
  }

 return (
  <div className="container d-flex justify-content-center mt-5">
    <div className="card shadow p-4" style={{ width: "380px" }}>

      <div className="text-center">

        {user.imgPath ? (
          <img
            src={user.imgPath}
            alt="Profile"
            className="rounded-circle border"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center mx-auto"
            style={{
              width: "100px",
              height: "100px",
              fontSize: "35px",
              fontWeight: "bold",
            }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}

        <h4 className="mt-3">{user.name}</h4>
        <span className="badge bg-success">{user.role}</span>

      </div>

      <hr />

      <div className="mb-2">
        <strong>Email:</strong>
        <p className="mb-2">{user.email}</p>
      </div>

      <div className="mb-2">
        <strong>Contact:</strong>
        <p className="mb-2">{user.contactNumber}</p>
      </div>

      <div className="mb-2">
        <strong>User ID:</strong>
        <p>#{user.id}</p>
      </div>

    </div>
  </div>
);
}