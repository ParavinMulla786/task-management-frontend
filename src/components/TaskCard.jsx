export default function TaskCard({
  task,
  onView,
}) {
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
      className="card border-0 shadow-sm mb-3"
      style={{ borderRadius: "14px" }}
    >
      <div className="card-body">

        <div className="d-flex justify-content-between align-items-start">

          <div>
            <h5 className="fw-bold mb-2">
              {task.title}
            </h5>

            <p className="text-muted mb-2">
              {task.description}
            </p>

            <span
              className={`badge ${getStatusClass()}`}
            >
              {task.status}
            </span>
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => onView(task)}
          >
            👁 View
          </button>

        </div>

        <hr />

        <div className="row text-muted small">
          <div className="col-md-6">
            📅 Start: {task.startDate || "N/A"}
          </div>

          <div className="col-md-6 text-md-end">
            🏁 End: {task.endDate || "N/A"}
          </div>
        </div>

      </div>
    </div>
  );
}