import { useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { useTheme } from "./context/ThemeContext";

function App() {
  const location = useLocation();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div
      className={`min-vh-100 ${
        isDark ? "bg-dark text-light" : "bg-light text-dark"
      }`}
    >

      <div className="d-flex">

        {/* SIDEBAR */}
        {!isAuthPage && (
          <div
            style={{ width: "250px" }}
            className={`min-vh-100 border-end ${
              isDark ? "bg-dark" : "bg-white"
            }`}
          >
            <Sidebar />
          </div>
        )}

        {/* MAIN AREA */}
        <div className="flex-grow-1">

          {/* NAVBAR */}
          {!isAuthPage && <Navbar />}

          {/* PAGE CONTENT */}
          <div className="p-3">
            <AppRoutes />
          </div>

        </div>

      </div>
    </div>
  );
}

export default App;