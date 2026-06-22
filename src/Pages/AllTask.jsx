import { useEffect, useState } from "react";
import { getAllTasks } from "../services/taskService";

export default function AllTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await getAllTasks();

      console.log("FULL API RESPONSE:", res.data);

      // ✅ SAFE FIX (IMPORTANT)
      const taskArray = res.data.data || [];

      setTasks(Array.isArray(taskArray) ? taskArray : []);

    } catch (error) {
      console.log(error);
      setTasks([]);
    }
  };

  return (
    <div className="container">

      <h3>📋 All Tasks</h3>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Status</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(tasks) &&
            tasks.map((task, index) => (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td>{task.title}</td>
                <td>{task.status}</td>
                <td>{task.startDate}</td>
                <td>{task.endDate}</td>
              </tr>
            ))}
        </tbody>
      </table>

    </div>
  );
}