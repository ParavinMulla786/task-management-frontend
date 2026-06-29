import { useTheme } from "../context/ThemeContext";

export default function FilterBar({
  status,
  month,
  sortBy,
  onStatus,
  onMonth,
  onSort,
  onReset,
}) {
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <div
      className={`card shadow-sm border-0 mb-4 ${
        isDark ? "bg-dark text-light" : "bg-white text-dark"
      }`}
    >
      <div className="card-body">
        <div className="row g-3 align-items-end">

          {/* Status Filter */}
          <div className="col-md-3">
            <label className="form-label fw-semibold">
              Status
            </label>

            <select
              className={`form-select ${
                isDark ? "bg-secondary text-light border-0" : ""
              }`}
              onChange={(e) => onStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Month Filter */}
          <div className="col-md-3">
            <label className="form-label fw-semibold">
              Month
            </label>

            <select
              className={`form-select ${
                isDark ? "bg-secondary text-light border-0" : ""
              }`}
              onChange={(e) => onMonth(e.target.value)}
            >
              <option value="">All Months</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>

          {/* Sort */}
          <div className="col-md-3">
            <label className="form-label fw-semibold">
              Sort By
            </label>

            <select
              className={`form-select ${
                isDark ? "bg-secondary text-light border-0" : ""
              }`}
              onChange={(e) => onSort(e.target.value)}
            >
              <option value="">Default</option>
              <option value="name">Task Name (A-Z)</option>
              <option value="startDate">Start Date</option>
              <option value="endDate">End Date</option>
            </select>
          </div>

          {/* Reset Button */}
          <div className="col-md-3">
            <label className="form-label fw-semibold opacity-0">
              Reset
            </label>

            <button
              className={`btn w-100 ${
                isDark
                  ? "btn-outline-light"
                  : "btn-outline-secondary"
              }`}
              onClick={onReset}
            >
              Reset
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}