import { useEffect, useState } from "react";
import { getPending } from "../services/taskService";

export default function PendingTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPending();
  }, []);

  const loadPending = async () => {
    try {
      setLoading(true);

      const res = await getPending();

      console.log("Pending API:", res.data);

      // backend: { success, data: [] }
      const data = res.data.data || [];

      setTasks(Array.isArray(data) ? data : []);

      setLoading(false);
    } catch (error) {
      console.log("Pending Error:", error);
      setTasks([]);
      setLoading(false);
    }
  };

  if (loading) return <h5>Loading Pending Tasks...</h5>;

  return (
    <div className="container">

      <h3 className="mb-3">🟡 Pending Tasks</h3>

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
                    No Pending Tasks
                  </td>
                </tr>
              ) : (
                tasks.map((task, index) => (
                  <tr key={task.id}>
                    <td>{index + 1}</td>
                    <td>{task.title}</td>

                    <td>
                      <span className="badge bg-warning text-dark">
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