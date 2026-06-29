import { useEffect, useState } from "react";
import { getInProgress } from "../services/taskService";
import { useTheme } from "../context/ThemeContext";

export default function InProgressTasks() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInProgress();
  }, []);

  const loadInProgress = async () => {
    try {
      setLoading(true);

      const res = await getInProgress();
      const data = res?.data?.data || [];

      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("InProgress Error:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // LOADING UI
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-2" />
        <h5 className={isDark ? "text-light" : ""}>
          Loading In Progress Tasks...
        </h5>
      </div>
    );
  }

  return (
    <div
      className={`container-fluid py-3 ${
        isDark ? "text-light" : "text-dark"
      }`}
    >

      {/* HEADER */}
      <div className="mb-3">
        <h3 className="fw-bold">🔵 In Progress Tasks</h3>
        <p className={isDark ? "opacity-75" : "text-muted"}>
          Tasks currently being worked on
        </p>
      </div>

      {/* TABLE CARD */}
      <div
        className={`card border-0 shadow-sm ${
          isDark ? "bg-dark text-light" : "bg-white"
        }`}
      >

        <div className="table-responsive">

          <table
            className={`table mb-0 ${
              isDark ? "table-dark table-hover" : "table-hover"
            }`}
          >

            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>

            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No In Progress Tasks Found
                  </td>
                </tr>
              ) : (
                tasks.map((task, index) => (
                  <tr key={task.id || index}>

                    <td>{index + 1}</td>

                    <td className={isDark ? "text-light" : ""}>
                      {task.title}
                    </td>

                    <td>
                      <span className="badge bg-info">
                        {task.status}
                      </span>
                    </td>

                    <td className={isDark ? "text-light" : ""}>
                      {task.startDate
                        ? new Date(task.startDate).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className={isDark ? "text-light" : ""}>
                      {task.endDate
                        ? new Date(task.endDate).toLocaleDateString()
                        : "N/A"}
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>

        </div>
      </div>
    </div>
  );
}