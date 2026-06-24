import { useEffect, useState } from "react";
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
} from "react-icons/fa";

export default function TaskModal({
  task,
  onClose,
  isAdmin,
  refresh,
}) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

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

  // DELETE
  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    await deleteTask(task.id);
    refresh();
    onClose();
  };

  // UPDATE
  const handleUpdate = async () => {
    await updateTask(task.id, form);
    setEditMode(false);
    refresh();
  };

  // ASSIGN
  const handleAssign = async () => {
    if (!selectedUser) return alert("Select user");
    await assignTask(task.id, selectedUser);
    alert("Task Assigned!");
    setSelectedUser("");
  };

  const statusBadge =
    task.status === "Completed"
      ? "bg-success"
      : task.status === "Pending"
      ? "bg-warning text-dark"
      : "bg-primary";

  return (
    <div
      className="modal d-block"
      style={{ background: "rgba(0,0,0,0.6)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg rounded-4">

          {/* HEADER */}
          <div className="modal-header">
            <h5 className="fw-bold">📋 Task Details</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          {/* BODY */}
          <div className="modal-body">

            {/* TITLE + DESCRIPTION */}
            {!editMode ? (
              <>
                <h4 className="fw-bold">{task.title}</h4>
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
                  className="form-control mb-2"
                  value={form.description || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                />
              </>
            )}

            <hr />

            {/* INFO GRID */}
            <div className="row">

              <div className="col-md-6 mb-2">
                <b>Status:</b>{" "}
                <span className={`badge ${statusBadge}`}>
                  {task.status}
                </span>
              </div>

              <div className="col-md-6 mb-2">
                <b>Start:</b> {task.startDate}
              </div>

              <div className="col-md-6 mb-2">
                <b>End:</b> {task.endDate}
              </div>

              <div className="col-md-6 mb-2">
                <b>Task ID:</b> #{task.id}
              </div>

            </div>

            {/* ADMIN PANEL */}
            {isAdmin && (
              <>
                <hr />

                {/* ASSIGN USER */}
                <select
                  className="form-select mb-2"
                  value={selectedUser}
                  onChange={(e) =>
                    setSelectedUser(e.target.value)
                  }
                >
                  <option value="">👤 Assign User</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>

                {/* BUTTONS */}
                <div className="d-flex gap-2 flex-wrap">

                  {/* EDIT */}
                  <button
                    className="btn btn-warning"
                    onClick={() => setEditMode(!editMode)}
                  >
                    <FaEdit /> Edit
                  </button>

                  {/* SAVE */}
                  {editMode && (
                    <button
                      className="btn btn-success"
                      onClick={handleUpdate}
                    >
                      <FaSave /> Save
                    </button>
                  )}

                  {/* ASSIGN */}
                  <button
                    className="btn btn-primary"
                    onClick={handleAssign}
                  >
                    <FaUserPlus /> Assign
                  </button>

                  {/* DELETE */}
                  <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                  >
                    <FaTrash /> Delete
                  </button>

                </div>
              </>
            )}
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={onClose}
            >
              <FaTimes /> Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}