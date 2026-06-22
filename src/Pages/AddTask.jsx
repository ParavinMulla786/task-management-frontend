import { useState } from "react";
import { createTask } from "../services/taskService";
import { useNavigate } from "react-router-dom";

export default function AddTask() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createTask(form);
      navigate("/tasks");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">

      <h3>➕ Add Task</h3>

      <form className="card p-4 shadow" onSubmit={handleSubmit}>

        <input
          name="title"
          className="form-control mb-2"
          placeholder="Title"
          onChange={handleChange}
        />

        <textarea
          name="description"
          className="form-control mb-2"
          placeholder="Description"
          onChange={handleChange}
        />

        <input
          type="date"
          name="startDate"
          className="form-control mb-2"
          onChange={handleChange}
        />

        <input
          type="date"
          name="endDate"
          className="form-control mb-3"
          onChange={handleChange}
        />

        <button className="btn btn-success w-100">
          Create Task
        </button>

      </form>

    </div>
  );
}