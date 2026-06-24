import api from "./api";

// REGISTER
export const registerUser = (data) =>
  api.post("/user/register", data);

// LOGIN
export const loginUser = async (data) => {
  const res = await api.post("/user/login", data);

  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  // SAVE USER DATA
  if (res.data.data) {
    localStorage.setItem(
      "user",
      JSON.stringify(res.data.data)
    );
  }

  return res;
};

// LOGOUT
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};