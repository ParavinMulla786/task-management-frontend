import { useTheme } from "../context/ThemeContext";

export default function SearchBar({ value, onChange }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="position-relative">

      {/* Input */}
      <input
        type="text"
        className={`form-control shadow-sm ${
          isDark ? "bg-secondary text-light border-0" : ""
        }`}
        placeholder="Search tasks by title or description..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          borderRadius: "12px",
          paddingLeft: "40px",
          height: "45px",
        }}
      />

      {/* Icon */}
      <span
        style={{
          position: "absolute",
          left: "14px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "18px",
          color: isDark ? "#f8f9fa" : "#6c757d",
        }}
      >
        🔍
      </span>
    </div>
  );
}