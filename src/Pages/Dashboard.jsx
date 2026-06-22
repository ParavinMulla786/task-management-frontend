import { useEffect, useState } from "react";
import {
  getAllTasks,
  getCompleted,
  getPending,
  getInProgress,
  getByStatus,
  getByMonth,
} from "../services/taskService";

import StatCard from "../components/StatCard";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  // ---------------- STATES ----------------
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [month, setMonth] = useState("");

  const [selectedTask, setSelectedTask] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    progress: 0,
  });

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [all, done, pending, progress] = await Promise.all([
        getAllTasks(),
        getCompleted(),
        getPending(),
        getInProgress(),
      ]);

      const allTasks = all?.data?.data || [];
      const completedTasks = done?.data?.data || [];
      const pendingTasks = pending?.data?.data || [];
      const progressTasks = progress?.data?.data || [];

      setTasks(allTasks);
      setFilteredTasks(allTasks);

      setStats({
        total: allTasks.length,
        completed: completedTasks.length,
        pending: pendingTasks.length,
        progress: progressTasks.length,
      });

    } catch (error) {
      console.log("Dashboard Error:", error);
    }
  };

  // ---------------- SEARCH ----------------
  useEffect(() => {
    let result = [...tasks];

    if (search) {
      result = result.filter(
        (t) =>
          t.title?.toLowerCase().includes(search.toLowerCase()) ||
          t.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredTasks(result);
  }, [search, tasks]);

  // ---------------- FILTER ----------------
  const applyFilter = async () => {
    try {
      if (status) {
        const res = await getByStatus(status);
        setFilteredTasks(res?.data?.data || []);
        return;
      }

      if (month) {
        const res = await getByMonth(month);
        setFilteredTasks(res?.data?.data || []);
        return;
      }

      setFilteredTasks(tasks);

    } catch (error) {
      console.log("Filter Error:", error);
    }
  };

  return (
    <div>

      {/* ---------------- HEADER ---------------- */}
      <div className="d-flex justify-content-between align-items-center mb-3">

        {/* SEARCH */}
        <div style={{ width: "40%" }}>
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {/* FILTER */}
        <FilterBar
          onStatus={setStatus}
          onMonth={setMonth}
          onApply={applyFilter}
        />

        {/* ADD TASK */}
        <button
          className="btn btn-success"
          onClick={() => navigate("/add-task")}
        >
          ➕ Add Task
        </button>

      </div>

      {/* ---------------- STATS ---------------- */}
      <div className="row">
        <StatCard title="Total" count={stats.total} color="primary" />
        <StatCard title="Pending" count={stats.pending} color="warning" />
        <StatCard title="In Progress" count={stats.progress} color="info" />
        <StatCard title="Completed" count={stats.completed} color="success" />
      </div>

      {/* ---------------- TASK LIST (CARDS) ---------------- */}
      <h5 className="mt-3">🧾 Recent Tasks</h5>

<div className="card shadow-sm">

  <div className="card-body p-0">

    <table className="table table-hover mb-0">

      {/* HEADER */}
      <thead className="table-light">
        <tr>
          <th>#</th>
          <th>Title</th>
          <th>Status</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Action</th>
        </tr>
      </thead>

      {/* BODY */}
      <tbody>

        {filteredTasks.length === 0 ? (
          <tr>
            <td colSpan="6" className="text-center p-3">
              No tasks found
            </td>
          </tr>
        ) : (
          filteredTasks.map((task, index) => (
            <tr key={task.id}>

              <td>{index + 1}</td>

              <td>{task.title}</td>

              {/* STATUS BADGE */}
              <td>
                <span className={
                  "badge " +
                  (task.status === "Completed"
                    ? "bg-success"
                    : task.status === "Pending"
                    ? "bg-warning text-dark"
                    : "bg-primary")
                }>
                  {task.status}
                </span>
              </td>

              <td>{task.startDate}</td>
              <td>{task.endDate}</td>

              <td>
                <button
                  className="btn btn-sm btn-outline-primary"
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

  </div>

</div>

      {/* ---------------- MODAL ---------------- */}
      <TaskModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />

    </div>
  );
}