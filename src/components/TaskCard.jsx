import { useTheme } from "../context/ThemeContext";

export default function TaskCard({ task, onView }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const getStatusClass = () => {
    switch (task.status) {
      case "Completed":
        return "bg-success";
      case "Pending":
        return "bg-warning text-dark";
      case "In Progress":
        return "bg-info";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div
      className={`card border-0 shadow-sm mb-3 ${
        isDark ? "bg-dark text-light" : "bg-white text-dark"
      }`}
      style={{
        borderRadius: "14px",
        transition: "all 0.3s ease",
      }}
    >
      <div className="card-body">

        <div className="d-flex justify-content-between align-items-start">

          {/* Left Content */}
          <div>
            <h5 className="fw-bold mb-2">
              {task.title}
            </h5>

            <p
              className={isDark ? "text-light opacity-75 mb-2" : "text-muted mb-2"}
            >
              {task.description}
            </p>

            <span className={`badge ${getStatusClass()}`}>
              {task.status}
            </span>
          </div>

          {/* View Button */}
          <button
            className={`btn btn-sm ${
              isDark ? "btn-outline-light" : "btn-primary"
            }`}
            onClick={() => onView(task)}
          >
            👁 View
          </button>

        </div>

        <hr className={isDark ? "border-light opacity-25" : ""} />

        <div className="row small">

          <div className={isDark ? "col-md-6 text-light opacity-75" : "col-md-6 text-muted"}>
            📅 Start: {task.startDate || "N/A"}
          </div>

          <div className={`col-md-6 text-md-end ${
            isDark ? "text-light opacity-75" : "text-muted"
          }`}>
            🏁 End: {task.endDate || "N/A"}
          </div>

        </div>

      </div>
    </div>
  );
}