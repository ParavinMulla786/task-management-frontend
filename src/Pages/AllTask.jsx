import { useEffect, useState } from "react";
import { getAllTasks } from "../services/taskService";
import { getTasksByUser } from "../services/taskService";
import TaskModal from "../components/TaskModal";

export default function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      let res;

      if (isAdmin) {
        // 👑 ADMIN → ALL TASKS
        res = await getAllTasks();
        setTasks(res.data.data || []);
      } else {
        // 👤 USER → ONLY ASSIGNED TASKS
        res = await getTasksByUser();

        // backend returns: { getTasks: [...] }
        const assignedTasks = res?.data?.getTasks || [];

        // extract actual tasks from include
        const tasksOnly = assignedTasks.map(
          (item) => item.Task
        );

        setTasks(tasksOnly);
      }
    } catch (err) {
      console.log(err);
      setTasks([]);
    }
  };

  return (
    <div className="container">

      <h3>
        {isAdmin ? "📋 All Tasks" : "📋 My Assigned Tasks"}
      </h3>

      <table className="table table-bordered mt-3">
        <thead>
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
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No Tasks Found
              </td>
            </tr>
          ) : (
            tasks.map((task, index) => (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td>{task.title}</td>
                <td>{task.status}</td>
                <td>{task.startDate}</td>
                <td>{task.endDate}</td>

                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => setSelectedTask(task)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* MODAL */}
      <TaskModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        isAdmin={isAdmin}
        refresh={loadTasks}
      />
    </div>
  );
}