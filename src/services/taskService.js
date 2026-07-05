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
export const updateTask = async (taskId, data) => {
  const response = await api.put(`/task/updateTask/${taskId}`, data);
  return response;
};

// ---------------- STATUS UPDATE ----------------
export const updateStatus = async (taskId, status) => {
  const response = await api.put(`/task/updateTask/${taskId}`, {
    status,
  });

  return response;
};

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

// ---------------- USER TASKS ----------------
export const getTasksByUser = () =>
  api.get("/assign-task/get-tasks-by-user");

// ---------------- ASSIGN TASK ----------------
export const assignTask = async (taskId, userId) => {
  const response = await api.post("/assign-task/assign", {
    taskID: taskId,
    userID: userId,
  });

  return response;
};

// ---------------- UNASSIGN TASK ----------------
// Create this API later in backend
export const unassignTask = async (taskId, userId) => {
  const response = await api.delete("/assign-task/unassign", {
    data: {
      taskID: taskId,
      userID: userId,
    },
  });

  return response;
};