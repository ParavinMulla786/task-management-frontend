import { useState } from "react";
import { createTask } from "../services/taskService";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function AddTask() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (!form.title || !form.description) {
        setError("Title and Description are required");
        return;
      }

      await createTask(form);
      navigate("/tasks");

    } catch (err) {
      console.log(err);
      setError(err?.response?.data?.msg || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fw-bold">➕ Add New Task</h3>

        <button
          className={`btn btn-sm ${
            isDark ? "btn-outline-light" : "btn-outline-secondary"
          }`}
          onClick={() => navigate("/")}
        >
          ← Back
        </button>
      </div>

      {/* CARD */}
      <div
        className={`card shadow-sm border-0 p-4 ${
          isDark ? "bg-dark text-light" : "bg-white text-dark"
        }`}
      >

        {/* ERROR */}
        {error && (
          <div className="alert alert-danger py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* TITLE */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Title
            </label>

            <input
              name="title"
              className={`form-control ${
                isDark ? "bg-secondary text-light border-0" : ""
              }`}
              placeholder="Enter task title"
              onChange={handleChange}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Description
            </label>

            <textarea
              name="description"
              className={`form-control ${
                isDark ? "bg-secondary text-light border-0" : ""
              }`}
              placeholder="Enter task description"
              rows="3"
              onChange={handleChange}
              required
            />
          </div>

          {/* DATES */}
          <div className="row">

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                Start Date
              </label>

              <input
                type="date"
                name="startDate"
                className={`form-control ${
                  isDark ? "bg-secondary text-light border-0" : ""
                }`}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">
                End Date
              </label>

              <input
                type="date"
                name="endDate"
                className={`form-control ${
                  isDark ? "bg-secondary text-light border-0" : ""
                }`}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* BUTTON */}
          <button
            className={`btn w-100 ${
              isDark ? "btn-success" : "btn-success"
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Task"}
          </button>

        </form>
      </div>
    </div>
  );
}