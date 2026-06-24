export default function StatCard({
  title,
  count,
  color = "primary",
  icon,
}) {
  return (
    <div className="col-lg-3 col-md-6 mb-4">
      <div
        className={`card border-0 shadow-sm bg-${color} text-white`}
        style={{
          borderRadius: "16px",
          minHeight: "120px",
        }}
      >
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h6
              className="mb-2"
              style={{
                opacity: 0.9,
                fontWeight: "500",
              }}
            >
              {title}
            </h6>

            <h2 className="fw-bold mb-0">
              {count}
            </h2>
          </div>

          <div
            style={{
              fontSize: "42px",
              opacity: 0.8,
            }}
          >
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}