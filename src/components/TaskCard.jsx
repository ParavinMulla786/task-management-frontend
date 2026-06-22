export default function TaskCard({ task, onView }) {
  return (
    <div className="card mb-2 shadow-sm">

      <div className="card-body d-flex justify-content-between align-items-center">

        <div>
          <h6 className="mb-1">{task.title}</h6>

          <span className={
            "badge " +
            (task.status === "Completed"
              ? "bg-success"
              : task.status === "Pending"
              ? "bg-warning text-dark"
              : "bg-primary")
          }>
            {task.status}
          </span>
        </div>

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => onView(task)}
        >
          View
        </button>

      </div>

    </div>
  );
}