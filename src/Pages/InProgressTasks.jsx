import { useEffect, useState } from "react";
import { getInProgress } from "../services/taskService";

export default function InProgressTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInProgress();
  }, []);

  const loadInProgress = async () => {
    try {
      setLoading(true);

      const res = await getInProgress();

      console.log("InProgress API:", res.data);

      const data = res?.data?.data || [];

      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("InProgress Error:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <h5>🔵 Loading In Progress Tasks...</h5>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">

      {/* HEADER */}
      <div className="mb-3">
        <h3 className="fw-bold">
          🔵 In Progress Tasks
        </h3>
        <p className="text-muted">
          Tasks currently being worked on
        </p>
      </div>

      {/* TABLE CARD */}
      <div className="card border-0 shadow-sm">

        <div className="table-responsive">

          <table className="table table-hover align-middle mb-0">

            <thead className="table-light">
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
                  <td
                    colSpan="5"
                    className="text-center p-4 text-muted"
                  >
                    No In Progress Tasks Found
                  </td>
                </tr>
              ) : (
                tasks.map((task, index) => (
                  <tr key={task.id}>

                    <td>{index + 1}</td>

                    <td className="fw-semibold">
                      {task.title}
                    </td>

                    <td>
                      <span className="badge bg-info">
                        {task.status}
                      </span>
                    </td>

                    <td>
                      {task.startDate
                        ? new Date(
                            task.startDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td>
                      {task.endDate
                        ? new Date(
                            task.endDate
                          ).toLocaleDateString()
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