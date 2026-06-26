import api from "./api";

// ================= REGISTER =================
export const registerUser = (formData) => {
  return api.post("/user/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ================= LOGIN =================
export const loginUser = async (data) => {
  const res = await api.post("/user/login", data);

  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  if (res.data.data) {
    localStorage.setItem(
      "user",
      JSON.stringify(res.data.data)
    );
  }

  return res;
};

// ================= LOGOUT =================
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};