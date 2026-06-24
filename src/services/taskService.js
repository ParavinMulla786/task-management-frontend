import api from "./api";

// ---------------- CREATE ----------------
export const createTask = (data) =>
  api.post("/task/create", data);

// ---------------- GET ALL ----------------
export const getAllTasks = () =>
  api.get("/task/getAll");

// ---------------- SINGLE TASK ----------------
export const getTaskById = (id) =>
  api.get(`/task/getTask/${id}`);

// ---------------- UPDATE ----------------
export const updateTask = (id, data) =>
  api.put(`/task/updateTask/${id}`, data);

// ---------------- STATUS UPDATE ----------------
export const updateStatus = (id, status) =>
  api.patch(`/task/updateStatus/${id}`, { status });

// ---------------- DELETE ----------------
export const deleteTask = (id) =>
  api.delete(`/task/deleteTask/${id}`);

// ---------------- FILTERS ----------------
export const getCompleted = () =>
  api.get("/task/getcompletedTask");

export const getPending = () =>
  api.get("/task/getpendingtask");

export const getInProgress = () =>
  api.get("/task/getinprogresstask");

export const getByStatus = (status) =>
  api.get(`/task/gettasksbystatus?status=${status}`);

export const getByMonth = (month) =>
  api.get(`/task/gettasksbyselectedmonth?month=${month}`);


export const assignTask = (taskID, userID) => {
  console.log("ASSIGN API HIT", taskID, userID);

  return api.post("/assign-task/assign-task", {
    taskID,
    userID,
  });
};
  // USERS


// taskService.js

// GET TASKS ASSIGNED TO LOGGED-IN USER
export const getTasksByUser = () =>
  api.get("/assign-task/get-tasks-by-user");