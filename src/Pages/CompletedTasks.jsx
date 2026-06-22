import { useEffect, useState } from "react";
import { getCompleted } from "../services/taskService";

export default function CompletedTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompleted();
  }, []);

  const fetchCompleted = async () => {
    try {
      setLoading(true);

      const res = await getCompleted();

      console.log("Completed API:", res.data);

      // backend returns: { success, data: [...] }
      const data = res.data.data || [];

      setTasks(Array.isArray(data) ? data : []);

      setLoading(false);
    } catch (error) {
      console.log("Completed Error:", error);
      setTasks([]);
      setLoading(false);
    }
  };

  if (loading) return <h5>Loading Completed Tasks...</h5>;

  return (
    <div className="container">

      <h3 className="mb-3"> Completed Tasks</h3>

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
                    No Completed Tasks
                  </td>
                </tr>
              ) : (
                tasks.map((task, index) => (
                  <tr key={task.id}>
                    <td>{index + 1}</td>
                    <td>{task.title}</td>
                    <td>
                      <span className="badge bg-success">
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