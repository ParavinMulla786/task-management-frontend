import { useEffect, useState } from "react";
import { getUserInfo, updateUserInfo } from "../services/userService";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const res = await getUserInfo();

      setUser(res.data.data);
      setFormData(res.data.data);
    } catch (error) {
      console.log(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleUpdate = async () => {
    try {
      const data = new FormData();
data.append("name", formData.name);
data.append("contactNumber", formData.contactNumber);

      if (formData.image) {
        data.append("image", formData.image);
      }

      const res = await updateUserInfo(data);

      alert("Profile Updated Successfully");

      setUser(res.data.data);
      setEditMode(false);

      loadProfile();
    } catch (error) {
      console.log(error);
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h4>Loading Profile...</h4>
      </div>
    );
  }

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
   
  <div className="container mt-5 d-flex justify-content-center">
    <div className="card shadow p-4" style={{ width: "700px" }}>
      <div className="row">

        {/* Left Side */}
        <div className="col-md-4 text-center border-end">

          {user.imgPath ? (
            <img
              src={user.imgPath}
              alt="Profile"
              className="rounded-circle border"
              style={{
                width: "140px",
                height: "140px",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center mx-auto"
              style={{
                width: "140px",
                height: "140px",
                fontSize: "50px",
                fontWeight: "bold",
              }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}

          {editMode && (
            <input
              type="file"
              className="form-control mt-3"
              accept="image/*"
              onChange={handleFileChange}
            />
          )}

          <h4 className="mt-3">{user.name}</h4>

          <span className="badge bg-success">
            {user.role}
          </span>
        </div>

        {/* Right Side */}
        <div className="col-md-8">

          <div className="row mb-3 align-items-center">
            <label className="col-sm-4 fw-bold">User ID</label>
            <div className="col-sm-8">
              <input
                className="form-control"
                value={user.id}
                readOnly
              />
            </div>
          </div>

          <div className="row mb-3 align-items-center">
            <label className="col-sm-4 fw-bold">Name</label>
            <div className="col-sm-8">
              {editMode ? (
                <input
                  className="form-control"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                />
              ) : (
                <input
                  className="form-control"
                  value={user.name}
                  readOnly
                />
              )}
            </div>
          </div>

          <div className="row mb-3 align-items-center">
            <label className="col-sm-4 fw-bold">Email</label>
            <div className="col-sm-8">
              <input
                className="form-control"
                value={user.email}
                readOnly
              />
            </div>
          </div>

          <div className="row mb-3 align-items-center">
            <label className="col-sm-4 fw-bold">Contact</label>
            <div className="col-sm-8">
              {editMode ? (
                <input
                  className="form-control"
                  name="contactNumber"
                  value={formData.contactNumber || ""}
                  onChange={handleChange}
                />
              ) : (
                <input
                  className="form-control"
                  value={user.contactNumber}
                  readOnly
                />
              )}
            </div>
          </div>

          <div className="row mb-4 align-items-center">
            <label className="col-sm-4 fw-bold">Role</label>
            <div className="col-sm-8">
              <input
                className="form-control"
                value={user.role}
                readOnly
              />
            </div>
          </div>

          {editMode ? (
            <div className="d-flex gap-2">
              <button
                className="btn btn-success"
                onClick={handleUpdate}
              >
                Save
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => {
                  setEditMode(false);
                  setFormData(user);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          )}

        </div>
      </div>
    </div>
  </div>
);
  
}