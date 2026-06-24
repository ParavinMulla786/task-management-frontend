import api from "./api";

// GET PROFILE (JWT REQUIRED)
export const getUserInfo = () =>
  api.get("/user/profile");

export const getAllUsers = () =>
  api.get("/user/allusers");

export const getTasksByUser = () =>
  api.get("/assign-task/get-tasks-by-user");