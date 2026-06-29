import { useEffect, useState } from "react";
import { getAllTasks, getTasksByUser } from "../services/taskService";
import TaskModal from "../components/TaskModal";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import { useTheme } from "../context/ThemeContext";

export default function AllTasks() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [month, setMonth] = useState("");
  const [sortBy, setSortBy] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  // 🔥 LOAD TASKS
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      let res;

      if (isAdmin) {
        res = await getAllTasks();
        setTasks(res?.data?.data || []);
      } else {
        res = await getTasksByUser();
        const tasksOnly = res?.data?.getTasks?.map((i) => i.Task) || [];
        setTasks(tasksOnly);
      }
    } catch (err) {
      console.log(err);
      setTasks([]);
    }
  };

  // 🔥 REAL-TIME UI SYNC
  const handleTaskUpdate = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => {
        const tId = t?.id || t?.task_id;
        const uId = updatedTask?.id || updatedTask?.task_id;

        return tId === uId ? { ...t, ...updatedTask } : t;
      })
    );
  };

  // 🔥 SAFE UNIQUE KEY (FIX FOR DUPLICATE KEY ERROR)
  const getTaskKey = (task, index) =>
    `${task?.id || task?.task_id || "task"}-${index}`;

  // 🔍 FILTERING
  let filteredTasks = [...tasks];

  if (search) {
    filteredTasks = filteredTasks.filter(
      (t) =>
        t?.title?.toLowerCase().includes(search.toLowerCase()) ||
        t?.description?.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (status) {
    filteredTasks = filteredTasks.filter((t) => t.status === status);
  }

  if (month) {
    filteredTasks = filteredTasks.filter((t) => {
      if (!t?.startDate) return false;

      const m = new Date(t.startDate).toLocaleString("default", {
        month: "long",
      });

      return m === month;
    });
  }

  // 🔥 SORTING
  switch (sortBy) {
    case "name":
      filteredTasks.sort((a, b) =>
        (a?.title || "").localeCompare(b?.title || "")
      );
      break;

    case "startDate":
      filteredTasks.sort(
        (a, b) =>
          new Date(a?.startDate || 0) - new Date(b?.startDate || 0)
      );
      break;

    case "endDate":
      filteredTasks.sort(
        (a, b) =>
          new Date(a?.endDate || 0) - new Date(b?.endDate || 0)
      );
      break;

    default:
      break;
  }

  // 🔥 DEBUG (REMOVE IN PRODUCTION)
  console.log(
    "DEBUG IDS:",
    filteredTasks.map((t, i) => `${t?.id || t?.task_id}-${i}`)
  );

  return (
    <div className={`container py-3 ${isDark ? "text-light" : "text-dark"}`}>

      {/* HEADER */}
      <h3>{isAdmin ? "📋 All Tasks" : "📋 My Tasks"}</h3>

      {/* SEARCH + FILTER */}
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <div className="col-md-8">
          <FilterBar
            status={status}
            month={month}
            sortBy={sortBy}
            onStatus={setStatus}
            onMonth={setMonth}
            onSort={setSortBy}
          />
        </div>
      </div>

      {/* TABLE */}
      <table className={`table table-hover ${isDark ? "table-dark" : ""}`}>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Status</th>
            <th>Start</th>
            <th>End</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredTasks.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No Tasks Found
              </td>
            </tr>
          ) : (
            filteredTasks.map((task, index) => (
              <tr key={getTaskKey(task, index)}>
                <td>{index + 1}</td>

                <td>{task?.title}</td>
                <td>{task?.status}</td>

                <td>
                  {task?.startDate
                    ? new Date(task.startDate).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  {task?.endDate
                    ? new Date(task.endDate).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setSelectedTask(task)}
                  >
                    View
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
        onUpdateTask={handleTaskUpdate}
      />
    </div>
  );
}