export default function StatCard({ title, count, color = "primary", icon }) {
  return (
    <div className="col-md-3 mb-3">

      <div className={`card border-0 shadow-sm text-white bg-${color}`} 
           style={{ borderRadius: "12px" }}>

        <div className="card-body d-flex align-items-center justify-content-between">

          {/* LEFT TEXT */}
          <div>
            <h6 className="mb-1 opacity-75">{title}</h6>
            <h3 className="mb-0 fw-bold">{count}</h3>
          </div>

          {/* ICON */}
          {icon && (
            <div style={{ fontSize: "28px", opacity: 0.8 }}>
              {icon}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}