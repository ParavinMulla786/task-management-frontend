import api from "./api";

// REGISTER
export const registerUser = (data) =>
  api.post("/user/register", data);

// LOGIN
export const loginUser = async (data) => {
  const res = await api.post("/user/login", data);

  // SAVE TOKEN (VERY IMPORTANT)
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res;
};

// LOGOUT
export const logoutUser = () => {
  localStorage.removeItem("token");
};