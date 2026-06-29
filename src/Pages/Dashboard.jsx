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
    try {
      setLoading(true);
      setError("");

      if (!isAdmin) {
        const res = await getTasksByUser();

        const assignedTasks = res?.data?.getTasks || [];
        const tasks = assignedTasks.map((item) => item.Task);

        setStats({
          total: tasks.length,
          pending: tasks.filter((t) => t.status === "Pending").length,
          progress: tasks.filter((t) => t.status === "In Progress").length,
          completed: tasks.filter((t) => t.status === "Completed").length,
          users: 0,
        });

        return;
      }

      const [
        allTasksRes,
        pendingTasksRes,
        progressTasksRes,
        completedTasksRes,
        usersRes,
      ] = await Promise.all([
        getAllTasks(),
        getPending(),
        getInProgress(),
        getCompleted(),
        getAllUsers(),
      ]);

      setStats({
        total: allTasksRes?.data?.data?.length || 0,
        pending: pendingTasksRes?.data?.data?.length || 0,
        progress: progressTasksRes?.data?.data?.length || 0,
        completed: completedTasksRes?.data?.data?.length || 0,
        users: usersRes?.data?.data?.length || 0,
      });

    } catch (error) {
      console.log("Dashboard Error:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-2" />
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

      {/* ERROR */}
      {error && (
        <div className="alert alert-danger py-2">
          {error}
        </div>
      )}

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <h3 className="fw-bold m-0">
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

      {/* EMPTY STATE */}
      {stats.total === 0 && !isAdmin ? (
        <div className="text-center py-5">
          <h5>No tasks assigned yet</h5>
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

          {/* 🔥 USERS CARD - SPECIAL COLOR */}
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