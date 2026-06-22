export default function TaskTable({ tasks = [], onView }) {
  if (!Array.isArray(tasks)) {
    return <h5>No tasks available</h5>;
  }

  return (
    <div className="card shadow-sm">

      <div className="card-body p-0">

        <table className="table table-hover mb-0">

          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Status</th>
              <th>Start</th>
              <th>End</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task, i) => (
              <tr key={task.id || i}>

                <td>{i + 1}</td>
                <td>{task.title}</td>

                <td>
                  <span className={`badge ${
                    task.status === "Completed"
                      ? "bg-success"
                      : task.status === "Pending"
                      ? "bg-warning text-dark"
                      : "bg-primary"
                  }`}>
                    {task.status}
                  </span>
                </td>

                <td>{task.startDate}</td>
                <td>{task.endDate}</td>

                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onView(task)}
                  >
                    View
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}