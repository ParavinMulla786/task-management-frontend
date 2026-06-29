import Sidebar from "../components/Sidebar";
import { useTheme } from "../context/ThemeContext";

export default function MainLayout({ children }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="d-flex min-vh-100">

      {/* SIDEBAR */}
      <div
        style={{ width: "250px" }}
        className={`border-end ${
          isDark ? "bg-dark text-light" : "bg-white text-dark"
        }`}
      >
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <div
        className={`flex-grow-1 p-4 ${
          isDark ? "bg-dark text-light" : "bg-light text-dark"
        }`}
      >
        {children}
      </div>

    </div>
  );
}