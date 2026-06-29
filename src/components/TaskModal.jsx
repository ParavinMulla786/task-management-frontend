import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { getAllUsers } from "../services/userService";
import {
  deleteTask,
  updateTask,
  assignTask,
} from "../services/taskService";

import {
  FaEdit,
  FaUserPlus,
  FaTrash,
  FaTimes,
  FaSave,
  FaUser,
} from "react-icons/fa";

export default function TaskModal({
  task,
  onClose,
  isAdmin,
  refresh,
  onUpdateTask, // 🔥 IMPORTANT (for instant UI sync)
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setForm(task);
      if (isAdmin) loadUsers();
    }
  }, [task]);

  const loadUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res?.data?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  if (!task) return null;

  // ✅ SAFE TASK ID (MySQL + Mongo support)
  const getTaskId = () => task?.id || task?.task_id;

  // 🔥 SAFE WRAPPER
  const safeAction = async (fn) => {
    try {
      setLoading(true);
      await fn();
      await refresh(); // reload table
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
      onClose();
    });
  };

  // 🔥 UPDATE TASK (EDIT MODE)
  const handleUpdate = async () => {
    await safeAction(async () => {
      await updateTask(getTaskId(), form);
      setEditMode(false);

      // 🔥 instant UI sync
      onUpdateTask?.({ ...task, ...form });
    });
  };

  // 🔥 STATUS UPDATE (IMPORTANT FIX)
  const handleStatusUpdate = async (value) => {
    setForm((prev) => ({ ...prev, status: value }));

    await safeAction(async () => {
      await updateTask(getTaskId(), { status: value });

      // 🔥 instant UI sync (admin + user both)
      onUpdateTask?.({
        ...task,
        status: value,
      });
    });
  };

  // 🔥 ASSIGN USER
  const handleAssign = async () => {
    if (!selectedUser) return alert("Please select a user");

    await safeAction(async () => {
      await assignTask(getTaskId(), selectedUser);
      setSelectedUser("");

      // optional sync
      onUpdateTask?.({
        ...task,
        assignedUser: { id: selectedUser },
      });
    });
  };

  // 📊 UI DATA
  const currentStatus = form.status || task.status;
  const assignedUserName = task.assignedUser?.name || "Unassigned";

  const start = new Date(task.startDate);
  const end = new Date(task.endDate);
  const today = new Date();

  const totalDays = Math.max(1, Math.ceil((end - start) / 86400000));
  const elapsedDays = Math.max(0, Math.ceil((today - start) / 86400000));

  let progress = Math.min(100, (elapsedDays / totalDays) * 100);
  if (currentStatus === "Completed") progress = 100;

  return (
    <div
      className="modal d-block"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog modal-md modal-dialog-centered">
        <div className={`modal-content ${isDark ? "bg-dark text-light" : ""}`}>

          {/* HEADER */}
          <div className="modal-header">
            <h5>📋 Task Details</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="modal-body">

            {loading && <div className="spinner-border" />}

            {!loading && (
              <>
                {/* TITLE */}
                {!editMode ? (
                  <>
                    <h5>{task.title}</h5>
                    <p className="text-muted">{task.description}</p>
                  </>
                ) : (
                  <>
                    <input
                      className="form-control mb-2"
                      value={form.title || ""}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                    />
                    <textarea
                      className="form-control"
                      value={form.description || ""}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </>
                )}

                {/* STATUS */}
                <span className="badge bg-primary mt-2">
                  {currentStatus}
                </span>

                {/* USER */}
                <div className="mt-2">
                  <FaUser /> {assignedUserName}
                </div>

                {/* PROGRESS */}
                <div className="mt-3">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* USER STATUS */}
                {!isAdmin && (
                  <select
                    className="form-select mt-3"
                    value={currentStatus}
                    onChange={(e) => handleStatusUpdate(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                )}

                {/* ADMIN */}
                {isAdmin && (
                  <>
                    {/* ASSIGN USER */}
                    <div className="mt-3 d-flex gap-2">
                      <select
                        className="form-select"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                      >
                        <option value="">Assign user</option>
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                      </select>

                      <button
                        className="btn btn-primary"
                        onClick={handleAssign}
                      >
                        <FaUserPlus />
                      </button>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-3 d-flex gap-2">
                      <button
                        className="btn btn-warning"
                        onClick={() => setEditMode(!editMode)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={handleDelete}
                      >
                        <FaTrash />
                      </button>

                      {editMode && (
                        <button
                          className="btn btn-success"
                          onClick={handleUpdate}
                        >
                          <FaSave />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              <FaTimes /> Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}