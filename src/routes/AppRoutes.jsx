import { Routes, Route } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import AllTask from"../Pages/AllTask";
import AddTask from "../Pages/AddTask";
import CompletedTasks from "../Pages/CompletedTasks";
import PendingTasks from "../Pages/PendingTasks";
import InProgressTasks from "../Pages/InProgressTasks";
import TasksByMonth from "../Pages/TasksByMonth";
import TasksByStatus from "../Pages/TasksByStatus";
import Profile from "../Pages/Profile";


export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<Dashboard />} />
      <Route path="/tasks" element={<AllTask />} />
      <Route path="/add-task" element={<AddTask />} />
      <Route path="/completed" element={<CompletedTasks />} />
      <Route path="/pending" element={<PendingTasks />} />
      <Route path="/in-progress" element={<InProgressTasks />} />
      <Route path="/tasks/status" element={<TasksByStatus />} />
      <Route path="/tasks/month" element={<TasksByMonth />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}