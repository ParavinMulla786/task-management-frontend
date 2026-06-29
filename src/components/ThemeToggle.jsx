import { useTheme } from "../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isLight = theme === "light";

  return (
    <button
      onClick={toggleTheme}
      className={`btn btn-sm d-flex align-items-center gap-2 ${
        isLight ? "btn-dark" : "btn-light"
      }`}
      style={{
        borderRadius: "20px",
        padding: "6px 12px",
        transition: "all 0.3s ease",
      }}
    >
      {isLight ? (
        <>
          <FaMoon />
          Dark
        </>
      ) : (
        <>
          <FaSun />
          Light
        </>
      )}
    </button>
  );
}