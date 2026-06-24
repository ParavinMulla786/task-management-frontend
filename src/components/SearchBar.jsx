export default function SearchBar({
  value,
  onChange,
}) {
  return (
    <div className="position-relative">
      <input
        type="text"
        className="form-control shadow-sm"
        placeholder="Search tasks by title or description..."
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={{
          borderRadius: "12px",
          paddingLeft: "40px",
          height: "45px",
        }}
      />

      <span
        style={{
          position: "absolute",
          left: "14px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "18px",
          color: "#6c757d",
        }}
      >
        🔍
      </span>
    </div>
  );
}