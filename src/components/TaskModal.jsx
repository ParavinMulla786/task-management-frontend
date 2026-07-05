import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { getAllUsers } from "../services/userService";
import {
  deleteTask,
  updateTask,
  updateStatus,
  assignTask,
  unassignTask,
} from "../services/taskService";

import {
  FaEdit,
  FaUserPlus,
  FaTrash,
  FaTimes,
  FaSave,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaUserMinus,
  FaUsers,
} from "react-icons/fa";

export default function TaskModal({
  task,
  onClose,
  isAdmin,
  refresh,
  onUpdateTask,
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  // ✅ Safer task initialization with debugging
  useEffect(() => {
    console.log("🔄 TaskModal received task:", task);
    console.log("👥 Task assignedUsers:", task?.assignedUsers);
    console.log("👤 Task assignedUser:", task?.assignedUser);
    
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "Pending",
        startDate: task.startDate || "",
        endDate: task.endDate || "",
        ...task,
      });
      setPendingStatus(null);
      if (isAdmin) loadUsers();
    }
  }, [task, isAdmin]);

  const loadUsers = async () => {
    try {
      const res = await getAllUsers();
      console.log("📋 Users loaded:", res?.data?.data);
      setUsers(res?.data?.data || []);
    } catch (err) {
      console.error("User load failed:", err);
    }
  };

  if (!task) return null;

  const getTaskId = () => task?.id || task?.task_id;

  // 🔥 SAFE WRAPPER
  const safeAction = async (fn) => {
    try {
      setLoading(true);
      await fn();
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 DELETE TASK
  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;

    await safeAction(async () => {
      await deleteTask(getTaskId());
      await refresh?.();
      onClose();
    });
  };

  // 🔥 UPDATE TASK (EDIT MODE)
  const handleUpdate = async () => {
    await safeAction(async () => {
      await updateTask(getTaskId(), form);
      setEditMode(false);

      const updatedTask = { ...task, ...form };
      onUpdateTask?.(updatedTask);
      await refresh?.();
    });
  };

  // 🔥 STATUS UPDATE
  const handleStatusSave = async () => {
    if (!pendingStatus) return;

    console.log("📤 Updating Status:", {
      taskId: getTaskId(),
      newStatus: pendingStatus
    });

    await safeAction(async () => {
      const response = await updateStatus(getTaskId(), pendingStatus);
      console.log("📥 Status update response:", response);
      
      setForm((prev) => ({
        ...prev,
        status: pendingStatus,
      }));

      onUpdateTask?.({
        ...task,
        status: pendingStatus,
      });

      setPendingStatus(null);
      await refresh?.();
    });
  };

  // 🔥 Handle status change
  const handleStatusChange = (value) => {
    setPendingStatus(value);
  };

  // 🔥 ASSIGN MULTIPLE USERS
  const handleAssignUser = async () => {
    if (!selectedUser) return alert("Please select a user");

    console.log("📤 Assigning user:", {
      taskId: getTaskId(),
      userId: selectedUser
    });

    await safeAction(async () => {
      // Find the user first (before API call)
      const assignedUser = users.find((u) => {
        const userId = u.id || u._id || u.userId;
        return String(userId) === String(selectedUser);
      });
      
      console.log("👤 User to assign:", assignedUser);
      
      // Create user object with full details
      const userToAdd = assignedUser ? {
        id: assignedUser.id || assignedUser._id || assignedUser.userId,
        name: assignedUser.name || assignedUser.username || "User",
        email: assignedUser.email || "",
      } : { 
        id: selectedUser,
        name: "User " + selectedUser 
      };
      
      // Call assign API
      await assignTask(getTaskId(), selectedUser);
      
      // Get current assigned users
      const currentAssignedUsers = task.assignedUsers || [];
      
      // Add new user if not already assigned
      if (!currentAssignedUsers.some(u => String(u.id) === String(userToAdd.id))) {
        const newAssignedUsers = [
          ...currentAssignedUsers,
          userToAdd
        ];
        
        const updatedTask = {
          ...task,
          assignedUsers: newAssignedUsers,
          assignedUser: newAssignedUsers[0] || null,
          assignedUserId: selectedUser,
        };
        
        console.log("🔄 Updated task with assigned users:", updatedTask);
        onUpdateTask?.(updatedTask);
        await refresh?.();
      } else {
        alert("User is already assigned to this task!");
      }
      
      setSelectedUser("");
    });
  };

  // 🔥 UNASSIGN USER
  const handleUnassignUser = async (userId) => {
    if (!window.confirm("Remove this user from the task?")) return;

    console.log("📤 Unassigning user:", {
      taskId: getTaskId(),
      userId: userId
    });

    await safeAction(async () => {
      await unassignTask(getTaskId(), userId);
      
      // Remove user from assigned list
      const currentAssignedUsers = task.assignedUsers || [];
      const newAssignedUsers = currentAssignedUsers.filter(u => String(u.id) !== String(userId));
      
      const updatedTask = {
        ...task,
        assignedUsers: newAssignedUsers,
        assignedUser: newAssignedUsers[0] || null,
        assignedUserId: newAssignedUsers[0]?.id || null,
      };
      
      console.log("🔄 Updated task after unassign:", updatedTask);
      onUpdateTask?.(updatedTask);
      await refresh?.();
    });
  };

  // 📊 UI DATA
  const currentStatus = pendingStatus || form.status || task.status;
  
  // Get assigned users list with better handling
  let assignedUsers = task.assignedUsers || [];
  
  // If no assignedUsers but has assignedUser (backward compatibility)
  if (assignedUsers.length === 0 && task.assignedUser) {
    assignedUsers = Array.isArray(task.assignedUser) 
      ? task.assignedUser 
      : [task.assignedUser];
  }
  
  // Filter out any undefined or null users
  const displayUsers = assignedUsers.filter(u => u && (u.id || u._id || u.userId));

  console.log("👥 Display users:", displayUsers);

  const formatDate = (date) => {
    if (!date) return "Not set";
    const d = new Date(date);
    if (isNaN(d)) return "Invalid date";
    return d.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const start = new Date(task.startDate);
  const end = new Date(task.endDate);
  const today = new Date();

  const validDates = !isNaN(start) && !isNaN(end) && end > start;

  const totalDays = validDates
    ? Math.max(1, Math.ceil((end - start) / 86400000))
    : 1;

  const elapsedDays = validDates
    ? Math.max(0, Math.ceil((today - start) / 86400000))
    : 0;

  let progress = Math.min(100, (elapsedDays / totalDays) * 100);
  if (currentStatus === "Completed") progress = 100;

  const getStatusColor = (status) => {
    switch(status) {
      case "Pending": return "bg-warning text-dark";
      case "In Progress": return "bg-primary";
      case "Completed": return "bg-success";
      default: return "bg-secondary";
    }
  };

  const hasPendingStatus = pendingStatus !== null && pendingStatus !== (form.status || task.status);

  return (
    <div
      className="modal d-block"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog modal-md modal-dialog-centered">
        <div className={`modal-content ${isDark ? "bg-dark text-light" : ""}`}>

          <div className="modal-header border-bottom">
            <h5 className="modal-title">📋 Task Details</h5>
            <button 
              className="btn-close" 
              onClick={onClose} 
              disabled={loading}
              style={isDark ? { filter: 'invert(1)' } : {}}
            />
          </div>

          <div className="modal-body">
            {loading && (
              <div className="d-flex justify-content-center my-3">
                <div className="spinner-border" />
              </div>
            )}

            {!loading && (
              <>
                {/* TITLE */}
                <div className="mb-3">
                  <label className="text-muted small fw-bold mb-1">TITLE</label>
                  {!editMode ? (
                    <h5 className="mb-0">{task.title}</h5>
                  ) : (
                    <input
                      className="form-control"
                      value={form.title || ""}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="Enter task title"
                    />
                  )}
                </div>

                {/* DESCRIPTION */}
                <div className="mb-3">
                  <label className="text-muted small fw-bold mb-1">DESCRIPTION</label>
                  {!editMode ? (
                    <p className="mb-0">{task.description || "No description provided"}</p>
                  ) : (
                    <textarea
                      className="form-control"
                      rows="3"
                      value={form.description || ""}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="Enter task description"
                    />
                  )}
                </div>

                {/* DATES */}
                <div className="row mb-3">
                  <div className="col-6">
                    <label className="text-muted small fw-bold mb-1">
                      <FaCalendarAlt className="me-1" /> START DATE
                    </label>
                    {!editMode ? (
                      <p className="mb-0">{formatDate(task.startDate)}</p>
                    ) : (
                      <input
                        type="date"
                        className="form-control"
                        value={form.startDate?.split('T')[0] || ""}
                        onChange={(e) =>
                          setForm({ ...form, startDate: e.target.value })
                        }
                      />
                    )}
                  </div>
                  <div className="col-6">
                    <label className="text-muted small fw-bold mb-1">
                      <FaCalendarAlt className="me-1" /> END DATE
                    </label>
                    {!editMode ? (
                      <p className="mb-0">{formatDate(task.endDate)}</p>
                    ) : (
                      <input
                        type="date"
                        className="form-control"
                        value={form.endDate?.split('T')[0] || ""}
                        onChange={(e) =>
                          setForm({ ...form, endDate: e.target.value })
                        }
                      />
                    )}
                  </div>
                </div>

                {/* STATUS - Display */}
                <div className="mb-3">
                  <label className="text-muted small fw-bold mb-1">STATUS</label>
                  {!editMode ? (
                    <div>
                      <span className={`badge ${getStatusColor(currentStatus)}`}>
                        {currentStatus}
                        {hasPendingStatus && " 🔄"}
                      </span>
                      {hasPendingStatus && (
                        <span className="ms-2 text-warning small">
                          (Unsaved changes)
                        </span>
                      )}
                    </div>
                  ) : (
                    <select
                      className="form-select"
                      value={form.status || "Pending"}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  )}
                </div>

                {/* ASSIGNED USERS - Multiple Users */}
                <div className="mb-3">
                  <label className="text-muted small fw-bold mb-1">
                    <FaUsers className="me-1" /> ASSIGNED USERS ({displayUsers.length})
                  </label>
                  {displayUsers.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {displayUsers.map((user, index) => (
                        <span 
                          key={user.id || user._id || user.userId || index} 
                          className="badge bg-info d-flex align-items-center gap-1 p-2"
                        >
                          <FaUser size={12} />
                          {user.name || user.username || "User"}
                          {isAdmin && !editMode && (
                            <button
                              className="btn btn-sm btn-danger ms-1 p-0"
                              onClick={() => handleUnassignUser(user.id || user._id || user.userId)}
                              disabled={loading}
                              style={{ width: '20px', height: '20px', lineHeight: '1' }}
                              title="Remove user"
                            >
                              <FaUserMinus size={10} />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No users assigned</p>
                  )}
                </div>

                {/* PROGRESS */}
                <div className="mb-3">
                  <label className="text-muted small fw-bold mb-1">PROGRESS</label>
                  <div className="d-flex align-items-center gap-2">
                    <div className="flex-grow-1">
                      <div className="progress">
                        <div
                          className="progress-bar progress-bar-striped progress-bar-animated"
                          style={{ width: `${progress}%` }}
                          role="progressbar"
                          aria-valuenow={progress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          {Math.round(progress)}%
                        </div>
                      </div>
                    </div>
                    <span className="fw-bold">{Math.round(progress)}%</span>
                  </div>
                </div>

                <hr className="my-3" />

                {/* STATUS UPDATE SECTION */}
                <div className="mb-3">
                  <label className="text-muted small fw-bold mb-1">
                    <FaClock className="me-1" /> UPDATE STATUS
                  </label>
                  <div className="d-flex gap-2">
                    <select
                      className="form-select"
                      value={pendingStatus !== null ? pendingStatus : currentStatus}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={loading || editMode}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <button
                      className="btn btn-success"
                      onClick={handleStatusSave}
                      disabled={loading || !hasPendingStatus || editMode}
                    >
                      <FaSave /> Save
                    </button>
                    {hasPendingStatus && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => setPendingStatus(null)}
                        disabled={loading || editMode}
                      >
                        <FaTimes /> Cancel
                      </button>
                    )}
                  </div>
                  {hasPendingStatus && (
                    <div className="mt-1 text-warning small">
                      ⚠️ Status changed to "{pendingStatus}". Click Save to update.
                    </div>
                  )}
                </div>

                <hr className="my-3" />

                {/* ADMIN CONTROLS */}
                {isAdmin && (
                  <>
                    {/* ASSIGN MULTIPLE USERS SECTION */}
                    <div className="mb-3">
                      <label className="text-muted small fw-bold mb-1">
                        <FaUserPlus className="me-1" /> ASSIGN NEW USER
                      </label>
                      <div className="d-flex gap-2">
                        <select
                          className="form-select"
                          value={selectedUser}
                          onChange={(e) => setSelectedUser(e.target.value)}
                          disabled={loading || editMode}
                        >
                          <option value="">Select user to assign...</option>
                          {users
                            .filter(u => {
                              const userId = u.id || u._id || u.userId;
                              // Filter out already assigned users
                              return !displayUsers.some(du => String(du.id || du._id || du.userId) === String(userId));
                            })
                            .map((u) => {
                              const userId = u.id || u._id || u.userId;
                              return (
                                <option key={userId} value={userId}>
                                  {u.name || u.username || "User " + userId}
                                </option>
                              );
                            })}
                        </select>
                        <button
                          className="btn btn-primary"
                          onClick={handleAssignUser}
                          disabled={loading || !selectedUser || editMode}
                        >
                          <FaUserPlus /> Assign
                        </button>
                      </div>
                      {users.length === 0 && (
                        <small className="text-muted">No users available to assign</small>
                      )}
                    </div>

                    {/* ADMIN ACTIONS */}
                    <div className="d-flex gap-2">
                      {!editMode ? (
                        <>
                          <button
                            className="btn btn-warning"
                            onClick={() => setEditMode(true)}
                            disabled={loading}
                          >
                            <FaEdit className="me-1" /> Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={handleDelete}
                            disabled={loading}
                          >
                            <FaTrash className="me-1" /> Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-success"
                            onClick={handleUpdate}
                            disabled={loading}
                          >
                            <FaSave className="me-1" /> Save Changes
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => {
                              setEditMode(false);
                              setForm({
                                title: task.title || "",
                                description: task.description || "",
                                status: task.status || "Pending",
                                startDate: task.startDate || "",
                                endDate: task.endDate || "",
                                ...task,
                              });
                              setPendingStatus(null);
                            }}
                            disabled={loading}
                          >
                            <FaTimes className="me-1" /> Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className="modal-footer border-top">
            <button
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              <FaTimes className="me-1" /> Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}