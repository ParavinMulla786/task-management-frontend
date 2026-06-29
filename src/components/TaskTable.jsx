import { useTheme } from "../context/ThemeContext";

export default function TaskTable({ tasks = [], onView, isAdmin }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!Array.isArray(tasks)) {
    return <h5>No tasks available</h5>;
  }

  return (
    <div
      className={`card shadow-sm border-0 ${
        isDark ? "bg-dark text-light" : "bg-white text-dark"
      }`}
    >
      <div className="card-body p-0">

        <table
          className={`table table-hover mb-0 ${
            isDark ? "table-dark" : ""
          }`}
        >

          {/* HEADER */}
          <thead className={isDark ? "" : "table-light"}>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Status</th>
              <th>Start</th>
              <th>End</th>

              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {tasks.map((task, i) => (
              <tr key={task.id || i}>

                <td>{i + 1}</td>

                <td className={isDark ? "text-light" : ""}>
                  {task.title}
                </td>

                <td>
                  <span
                    className={`badge ${
                      task.status === "Completed"
                        ? "bg-success"
                        : task.status === "Pending"
                        ? "bg-warning text-dark"
                        : "bg-primary"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>

                <td className={isDark ? "text-light" : ""}>
                  {task.startDate}
                </td>

                <td className={isDark ? "text-light" : ""}>
                  {task.endDate}
                </td>

                {/* ADMIN ACTIONS */}
                {isAdmin && (
                  <td>
                    <button
                      className={`btn btn-sm ${
                        isDark
                          ? "btn-outline-light"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => onView(task)}
                    >
                      View
                    </button>
                  </td>
                )}

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </div>
  );
}