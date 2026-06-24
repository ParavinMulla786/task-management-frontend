import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const linkClass = ({ isActive }) =>
    `list-group-item border-0 rounded mb-2 ${
      isActive
        ? "bg-primary text-white fw-semibold"
        : "bg-transparent text-light"
    }`;

  return (
    <div className="p-3 text-white h-100">

      {/* Logo */}
      <div className="mb-4">
        <h4 className="fw-bold">📋 Task Manager</h4>
      </div>

      {/* User Info */}
      <div className="mb-4 p-3 rounded bg-dark">
        <small className="text-secondary">Logged in as</small>

        <h6 className="mb-1 mt-1">
          {user?.name}
        </h6>

        <span
          className={`badge ${
            user?.role === "admin"
              ? "bg-danger"
              : "bg-primary"
          }`}
        >
          {user?.role}
        </span>
      </div>

      <small className="text-secondary">
        MENU
      </small>

      <div className="list-group list-group-flush mt-2">

        {/* Dashboard */}
        <NavLink to="/" className={linkClass}>
          📊 Dashboard
        </NavLink>

        {/* USER MENU */}
        {user?.role?.toLowerCase() === "user" && (
          <>
            <NavLink
              to="/tasks"
              className={linkClass}
            >
              📋 My Tasks
            </NavLink>
          </>
        )}

        {/* ADMIN MENU */}
        {user?.role?.toLowerCase() === "admin" && (
          <>
            <NavLink
              to="/tasks"
              className={linkClass}
            >
              📋 All Tasks
            </NavLink>

            <NavLink
              to="/add-task"
              className={linkClass}
            >
              ➕ Add Task
            </NavLink>

            <NavLink
              to="/completed"
              className={linkClass}
            >
              ✅ Completed Tasks
            </NavLink>

            <NavLink
              to="/pending"
              className={linkClass}
            >
              ⏳ Pending Tasks
            </NavLink>

            <NavLink
              to="/in-progress"
              className={linkClass}
            >
              🚀 In Progress
            </NavLink>
          </>
        )}

      </div>
    </div>
  );
}