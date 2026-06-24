import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StatCard from "../components/StatCard";

import {
  getAllTasks,
  getCompleted,
  getPending,
  getInProgress,
} from "../services/taskService";

import {
  getAllUsers,
  getTasksByUser,
} from "../services/userService"; // IMPORTANT

export default function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    completed: 0,
    users: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      console.log("Current User:", user);

      // ================= USER DASHBOARD =================
      if (!isAdmin) {
        const res = await getTasksByUser();

        // backend: { getTasks: [...] }
        const assignedTasks =
          res?.data?.getTasks || [];

        const tasks = assignedTasks.map(
          (item) => item.Task
        );

        setStats({
          total: tasks.length,
          pending: tasks.filter(
            (t) => t.status === "Pending"
          ).length,
          progress: tasks.filter(
            (t) => t.status === "In Progress"
          ).length,
          completed: tasks.filter(
            (t) => t.status === "Completed"
          ).length,
          users: 0,
        });

        return;
      }

      // ================= ADMIN DASHBOARD =================
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

      const total = allTasksRes?.data?.data || [];
      const pending = pendingTasksRes?.data?.data || [];
      const progress = progressTasksRes?.data?.data || [];
      const completed = completedTasksRes?.data?.data || [];
      const usersCount =
        usersRes?.data?.data?.length || 0;

      setStats({
        total: total.length,
        pending: pending.length,
        progress: progress.length,
        completed: completed.length,
        users: usersCount,
      });
    } catch (error) {
      console.log("Dashboard Error:", error);
    }
  };

  return (
    <div className="container-fluid">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          {isAdmin ? "Admin Dashboard" : "My Dashboard"}
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

      <div className="row">

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
            color="dark"
            icon="👥"
          />
        )}
      </div>
    </div>
  );
}