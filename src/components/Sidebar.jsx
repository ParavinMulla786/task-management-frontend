import { NavLink } from "react-router-dom";
import { getUserInfo } from "../services/userService";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [user, setUser] = useState(null);

  const linkClass = ({ isActive }) =>
    `list-group-item bg-dark text-light border-0 ${
      isActive ? "text-primary fw-bold" : "text-secondary"
    }`;

  async function createUser() {
    try {
      const res = await getUserInfo();

      console.log("Response:", res.data);

      setUser(res.data.data); // <- important
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    createUser();
  }, []);

  return (
    <div className="p-3 text-white">

      {/* Header */}
      <h4 className="fw-bold mb-4">Task Manager</h4>

      {/* User Info */}
      {user && (
        <div className="mb-4">
          <h6>{user.name}</h6>
          <span className="badge bg-primary">
            {user.role}
          </span>
        </div>
      )}

      <small className="text-secondary">Navigation</small>

      <div className="list-group list-group-flush mt-2">

        {/* Common Routes */}
        <NavLink to="/" className={linkClass}>
          📊 Dashboard
        </NavLink>

        {/* USER ROUTES */}
        {user?.role === "user" && (
          <>
            <NavLink to="/tasks" className={linkClass}>
              📋 My Tasks
            </NavLink>
          </>
        )}

        {/* ADMIN ROUTES */}
        {user?.role === "admin" && (
          <>
            <NavLink to="/tasks" className={linkClass}>
              📋 All Tasks
            </NavLink>

            <NavLink to="/add-task" className={linkClass}>
              ➕ Add Task
            </NavLink>

            <NavLink to="/completed" className={linkClass}>
              ✅ Completed Tasks
            </NavLink>

            <NavLink to="/pending" className={linkClass}>
              🟡 Pending Tasks
            </NavLink>

            <NavLink to="/in-progress" className={linkClass}>
              🔵 In Progress Tasks
            </NavLink>

            <hr />

            <small className="text-secondary">
              Task Filters
            </small>

            <NavLink
              to="/tasks/month"
              className={linkClass}
            >
              📅 Tasks By Month
            </NavLink>

            <NavLink
              to="/tasks/status"
              className={linkClass}
            >
              🔍 Tasks By Status
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
}