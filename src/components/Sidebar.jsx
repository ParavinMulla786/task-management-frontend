import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const { theme } = useTheme();

  // 👉 Sidebar is ALWAYS OPPOSITE of main theme
  const sidebarTheme = theme === "light" ? "dark" : "light";

  const linkClass = ({ isActive }) =>
    `list-group-item border-0 rounded mb-2 ${
      isActive
        ? "bg-primary text-white fw-semibold"
        : sidebarTheme === "dark"
        ? "bg-transparent text-light"
        : "bg-transparent text-dark"
    }`;

  return (
    <div
      className={`p-3 h-100 sidebar-custom ${
        sidebarTheme === "dark"
          ? "bg-dark text-light"
          : "bg-light text-dark"
      }`}
    >
      {/* Logo */}
      <div className="mb-4">
        <h4 className="fw-bold">📋 Task Manager</h4>
      </div>

      {/* User Info */}
      <div
        className={`mb-4 p-3 rounded ${
          sidebarTheme === "dark" ? "bg-secondary" : "bg-white shadow-sm"
        }`}
      >
        <small
          className={
            sidebarTheme === "dark" ? "text-light" : "text-muted"
          }
        >
          Logged in as
        </small>

        <h6 className="mb-1 mt-1">{user?.name}</h6>

        <span
          className={`badge ${
            user?.role?.toLowerCase() === "admin"
              ? "bg-danger"
              : "bg-primary"
          }`}
        >
          {user?.role}
        </span>
      </div>

      <small
        className={
          sidebarTheme === "dark" ? "text-light" : "text-muted"
        }
      >
        MENU
      </small>

      <div className="list-group list-group-flush mt-2">
        <NavLink to="/" className={linkClass}>
          📊 Dashboard
        </NavLink>

        {user?.role?.toLowerCase() === "user" && (
          <NavLink to="/tasks" className={linkClass}>
            📋 My Tasks
          </NavLink>
        )}

        {user?.role?.toLowerCase() === "admin" && (
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
              ⏳ Pending Tasks
            </NavLink>

            <NavLink to="/in-progress" className={linkClass}>
              🚀 In Progress
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
}