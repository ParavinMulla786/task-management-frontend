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

      // ✅ SAFE EXTRACTION (prevents crash)
      const userData = res?.data?.data;

      if (userData) {
        setUser(userData);
      } else {
        console.log("Invalid response format");
        setUser(null);
      }

      setLoading(false);

    } catch (error) {
      console.log("Profile Error:", error?.response?.data || error.message);
      setUser(null);
      setLoading(false);
    }
  };

  if (loading) return <h5>Loading Profile...</h5>;

  if (!user) {
    return (
      <div className="alert alert-danger">
        Profile not found or unauthorized access.
      </div>
    );
  }

  return (
    <div className="card p-4 shadow">

      <h3>Profile</h3>
      <hr />

      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Role:</b> {user.role}</p>
      <p><b>Contact:</b> {user.contactNumber}</p>

    </div>
  );
}