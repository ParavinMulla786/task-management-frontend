import api from "./api";

// GET PROFILE (JWT REQUIRED)
export const getUserInfo = () =>
  api.get("/user/profile");