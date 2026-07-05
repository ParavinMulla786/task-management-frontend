import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import { useTheme } from "../context/ThemeContext";

import {
  getAllTasks,
  getCompleted,
  getPending,
  getInProgress,
} from "../services/taskService";

import {
  getAllUsers,
  getTasksByUser,
} from "../services/userService";

export default function Dashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    completed: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      if (!isAdmin) {
        const response = await getTasksByUser();

        const assignedTasks = response?.data?.getTasks || [];

        const tasks = assignedTasks
          .map((item) => item.task)
          .filter(Boolean);

        setStats({
          total: tasks.length,
          pending: tasks.filter((task) => task.status === "Pending").length,
          progress: tasks.filter(
            (task) => task.status === "In Progress"
          ).length,
          completed: tasks.filter(
            (task) => task.status === "Completed"
          ).length,
          users: 0,
        });

        return;
      }

      const results = await Promise.allSettled([
        getAllTasks(),
        getPending(),
        getInProgress(),
        getCompleted(),
        getAllUsers(),
      ]);

      const allTasks =
        results[0].status === "fulfilled"
          ? results[0].value?.data?.data || []
          : [];

      const pending =
        results[1].status === "fulfilled"
          ? results[1].value?.data?.data || []
          : [];

      const progress =
        results[2].status === "fulfilled"
          ? results[2].value?.data?.data || []
          : [];

      const completed =
        results[3].status === "fulfilled"
          ? results[3].value?.data?.data || []
          : [];

      const users =
        results[4].status === "fulfilled"
          ? results[4].value?.data?.data || []
          : [];

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(`API ${index + 1} Failed:`, result.reason);
        }
      });

      setStats({
        total: allTasks.length,
        pending: pending.length,
        progress: progress.length,
        completed: completed.length,
        users: users.length,
      });
    } catch (err) {
      console.error("Dashboard Error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-3"></div>
        <h5 className={isDark ? "text-light" : ""}>
          Loading Dashboard...
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
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">
          {isAdmin ? "📊 Admin Dashboard" : "📊 My Dashboard"}
        </h3>

        {isAdmin && (
          <button
            className="btn btn-success"
            onClick={() => navigate("/add-task")}
          >
            ➕ Add Task
          </button>
        )}
      </div>

      {!isAdmin && stats.total === 0 ? (
        <div className="text-center py-5">
          <h5>No tasks assigned yet.</h5>
        </div>
      ) : (
        <div className="row g-3">
          <StatCard
            title={isAdmin ? "Total Tasks" : "My Tasks"}
            count={stats.total}
            color="primary"
            icon="📋"
          />

          <StatCard
            title={isAdmin ? "Pending" : "My Pending"}
            count={stats.pending}
            color="warning"
            icon="⏳"
          />

          <StatCard
            title={isAdmin ? "In Progress" : "My Progress"}
            count={stats.progress}
            color="info"
            icon="🚀"
          />

          <StatCard
            title={isAdmin ? "Completed" : "My Completed"}
            count={stats.completed}
            color="success"
            icon="✅"
          />

          {isAdmin && (
            <StatCard
              title="Users"
              count={stats.users}
              color="purple"
              icon="👥"
            />
          )}
        </div>
      )}
    </div>
  );
}