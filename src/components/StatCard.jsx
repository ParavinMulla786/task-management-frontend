export default function StatCard({
  title,
  count,
  color = "primary",
  icon,
}) {
  const colorMap = {
    primary: "bg-primary",
    success: "bg-success",
    danger: "bg-danger",
    warning: "bg-warning text-dark",
    info: "bg-info",
    dark: "bg-dark",
    purple: "bg-purple",
  };

  return (
    <div className="col-lg-3 col-md-6 mb-4">
      <div
        className={`card border-0 shadow-sm text-white stat-card ${
          colorMap[color] || "bg-primary"
        }`}
        style={{
          borderRadius: "16px",
          minHeight: "120px",
        }}
      >
        <div className="card-body d-flex justify-content-between align-items-center">

          {/* LEFT SIDE */}
          <div>
            <h6
              className="mb-2"
              style={{
                opacity: 0.85,
                fontWeight: "500",
              }}
            >
              {title}
            </h6>

            <h2 className="fw-bold mb-0">
              {count}
            </h2>
          </div>

          {/* ICON */}
          <div
            style={{
              fontSize: "42px",
              opacity: 0.85,
            }}
          >
            {icon}
          </div>

        </div>
      </div>
    </div>
  );
}