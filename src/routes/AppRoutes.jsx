import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../Pages/Dashboard";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import AllTask from "../Pages/AllTask";
import AddTask from "../Pages/AddTask";
import CompletedTasks from "../Pages/CompletedTasks";
import PendingTasks from "../Pages/PendingTasks";
import InProgressTasks from "../Pages/InProgressTasks";
import TasksByMonth from "../Pages/TasksByMonth";
import TasksByStatus from "../Pages/TasksByStatus";
import Profile from "../Pages/Profile";

// Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // JWT stored after login

  return token ? children : <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <AllTask />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-task"
        element={
          <ProtectedRoute>
            <AddTask />
          </ProtectedRoute>
        }
      />

      <Route
        path="/completed"
        element={
          <ProtectedRoute>
            <CompletedTasks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/pending"
        element={
          <ProtectedRoute>
            <PendingTasks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/in-progress"
        element={
          <ProtectedRoute>
            <InProgressTasks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/status"
        element={
          <ProtectedRoute>
            <TasksByStatus />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/month"
        element={
          <ProtectedRoute>
            <TasksByMonth />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}