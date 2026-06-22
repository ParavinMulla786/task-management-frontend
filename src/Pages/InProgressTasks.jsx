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

      // backend response: { success, data: [] }
      const data = res.data.data || [];

      setTasks(Array.isArray(data) ? data : []);

      setLoading(false);
    } catch (error) {
      console.log("InProgress Error:", error);
      setTasks([]);
      setLoading(false);
    }
  };

  if (loading) return <h5>Loading In Progress Tasks...</h5>;

  return (
    <div className="container">

      <h3 className="mb-3">🔵 In Progress Tasks</h3>

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
              </tr>
            </thead>

            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No In Progress Tasks
                  </td>
                </tr>
              ) : (
                tasks.map((task, index) => (
                  <tr key={task.id}>
                    <td>{index + 1}</td>
                    <td>{task.title}</td>

                    <td>
                      <span className="badge bg-primary">
                        {task.status}
                      </span>
                    </td>

                    <td>{task.startDate}</td>
                    <td>{task.endDate}</td>
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
