import { useEffect, useState } from "react";
import { getAllTasks, getTasksByUser } from "../services/taskService";
import { getAllUsers } from "../services/userService";
import TaskModal from "../components/TaskModal";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import { useTheme } from "../context/ThemeContext";

export default function AllTasks() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [month, setMonth] = useState("");
  const [sortBy, setSortBy] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadAllData();
  }, []);

  // Helper functions for localStorage
  const saveAssignedUsersToStorage = (taskId, assignedUsers) => {
    try {
      const storageKey = `task_assigned_users_${taskId}`;
      localStorage.setItem(storageKey, JSON.stringify(assignedUsers));
      console.log(`💾 Saved assigned users for task ${taskId}:`, assignedUsers);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const getAssignedUsersFromStorage = (taskId) => {
    try {
      const storageKey = `task_assigned_users_${taskId}`;
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  };

  // Load both tasks and users
  const loadAllData = async () => {
    try {
      if (isAdmin) {
        const usersRes = await getAllUsers();
        const usersList = usersRes?.data?.data || [];
        setAllUsers(usersList);
        console.log("📋 All users loaded:", usersList);
      }
      await loadTasks();
    } catch (err) {
      console.error("❌ Load data error:", err);
    }
  };

  // Load Tasks with user enrichment
  const loadTasks = async () => {
    try {
      let res;
      let taskList = [];

      if (isAdmin) {
        res = await getAllTasks();
        console.log("📋 Admin Response:", res.data);
        taskList = res?.data?.data || [];
      } else {
        res = await getTasksByUser();
        console.log("📋 User Response:", res.data);
        taskList = res?.data?.getTasks?.map((item) => item.task).filter(Boolean) || [];
      }

      // 🔥 ENRICH TASKS WITH USER DATA
      const enrichedTasks = taskList.map(task => {
        const taskId = task.id || task.task_id;
        
        // First try to get assignedUsers from API response
        let assignedUsers = task.assignedUsers || [];
        
        // If not in API response, try localStorage
        if (!assignedUsers || assignedUsers.length === 0) {
          const storedUsers = getAssignedUsersFromStorage(taskId);
          if (storedUsers && storedUsers.length > 0) {
            console.log(`📦 Using stored users for task ${taskId}:`, storedUsers);
            assignedUsers = storedUsers;
          }
        }
        
        // If still no users and we have allUsers, try to find by assignedUserId
        if (assignedUsers.length === 0 && task.assignedUserId) {
          const foundUser = allUsers.find(u => {
            const auId = u.id || u._id || u.userId;
            return String(auId) === String(task.assignedUserId);
          });
          if (foundUser) {
            assignedUsers = [{
              id: foundUser.id || foundUser._id || foundUser.userId,
              name: foundUser.name || foundUser.username || "User",
              email: foundUser.email || ""
            }];
          }
        }
        
        return {
          ...task,
          assignedUsers: assignedUsers,
          assignedUser: assignedUsers.length > 0 ? assignedUsers[0] : null
        };
      });

      console.log("📊 Enriched tasks:", enrichedTasks);
      setTasks(enrichedTasks);
    } catch (err) {
      console.error("❌ Load tasks error:", err);
      setTasks([]);
    }
  };

  // 🔥 Update task instantly with localStorage
  const handleTaskUpdate = (updatedTask) => {
    console.log("🔄 Updating task in parent:", updatedTask);
    
    if (!updatedTask) return;
    
    // Save assigned users to localStorage
    const taskId = updatedTask.id || updatedTask.task_id;
    if (updatedTask.assignedUsers) {
      saveAssignedUsersToStorage(taskId, updatedTask.assignedUsers);
    }

    setTasks((prev) =>
      prev.map((t) => {
        const tId = t?.id || t?.task_id;
        const uId = updatedTask?.id || updatedTask?.task_id;

        if (tId === uId) {
          const mergedTask = { 
            ...t, 
            ...updatedTask,
            status: updatedTask.status || t.status,
            assignedUsers: updatedTask.assignedUsers || t.assignedUsers || []
          };
          console.log("✅ Task updated in list:", {
            id: mergedTask.id || mergedTask.task_id,
            title: mergedTask.title,
            assignedUsers: mergedTask.assignedUsers
          });
          return mergedTask;
        }
        return t;
      })
    );

    setSelectedTask((prev) => {
      if (!prev) return prev;
      
      const prevId = prev?.id || prev?.task_id;
      const updatedId = updatedTask?.id || updatedTask?.task_id;
      
      if (prevId === updatedId) {
        const mergedSelected = { 
          ...prev, 
          ...updatedTask,
          status: updatedTask.status || prev.status,
          assignedUsers: updatedTask.assignedUsers || prev.assignedUsers || []
        };
        console.log("✅ Selected task updated:", mergedSelected);
        return mergedSelected;
      }
      return prev;
    });
  };

  const getTaskKey = (task, index) =>
    `${task?.id || task?.task_id || "task"}-${index}`;

  // Filtering
  let filteredTasks = [...tasks];

  if (search) {
    filteredTasks = filteredTasks.filter(
      (t) =>
        t?.title?.toLowerCase().includes(search.toLowerCase()) ||
        t?.description?.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (status) {
    filteredTasks = filteredTasks.filter((t) => t?.status === status);
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

  const highlightText = (text = "", search = "") => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} className="bg-warning text-dark px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className={`container py-3 ${isDark ? "text-light" : "text-dark"}`}>
      <h3>{isAdmin ? "📋 All Tasks" : "📋 My Tasks"}</h3>

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

      <table className={`table table-hover ${isDark ? "table-dark" : ""}`}>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Start</th>
            <th>End</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                No Tasks Found
              </td>
            </tr>
          ) : (
            filteredTasks.map((task, index) => (
              <tr key={getTaskKey(task, index)}>
                <td>{index + 1}</td>
                <td>{highlightText(task?.title, search)}</td>
                <td>
                  <span className={`badge ${
                    task?.status === "Completed" ? "bg-success" :
                    task?.status === "In Progress" ? "bg-primary" :
                    task?.status === "Pending" ? "bg-warning text-dark" :
                    "bg-secondary"
                  }`}>
                    {highlightText(task?.status, search)}
                  </span>
                </td>
                <td>
                  <span className="badge bg-info">
                    {task?.assignedUsers?.length > 0 
                      ? task.assignedUsers.map(u => u.name || "User").join(", ")
                      : "Unassigned"}
                  </span>
                </td>
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
                    onClick={() => {
                      console.log("📝 View Task:", task);
                      console.log("👤 Assigned Users:", task.assignedUsers);
                      setSelectedTask(task);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* table */}

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => {
            setSelectedTask(null);
            loadTasks();
          }}
          isAdmin={isAdmin}
          refresh={loadTasks}
          onUpdateTask={handleTaskUpdate}
        />
      )}
    </div>
  );
}