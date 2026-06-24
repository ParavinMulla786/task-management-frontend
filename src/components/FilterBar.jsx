export default function FilterBar({
  onStatus,
  onMonth,
  onApply,
}) {
  return (
    <div className="card shadow-sm border-0 mb-4">
      <div className="card-body">
        <div className="row g-3 align-items-end">

          {/* Status Filter */}
          <div className="col-md-4">
            <label className="form-label fw-semibold">
              Status
            </label>

            <select
              className="form-select"
              onChange={(e) =>
                onStatus(e.target.value)
              }
            >
              <option value="">
                All Status
              </option>
              <option value="Pending">
                Pending
              </option>
              <option value="In Progress">
                In Progress
              </option>
              <option value="Completed">
                Completed
              </option>
            </select>
          </div>

          {/* Month Filter */}
          <div className="col-md-4">
            <label className="form-label fw-semibold">
              Month
            </label>

            <select
              className="form-select"
              onChange={(e) =>
                onMonth(e.target.value)
              }
            >
              <option value="">
                All Months
              </option>

              <option value="January">
                January
              </option>
              <option value="February">
                February
              </option>
              <option value="March">
                March
              </option>
              <option value="April">
                April
              </option>
              <option value="May">
                May
              </option>
              <option value="June">
                June
              </option>
              <option value="July">
                July
              </option>
              <option value="August">
                August
              </option>
              <option value="September">
                September
              </option>
              <option value="October">
                October
              </option>
              <option value="November">
                November
              </option>
              <option value="December">
                December
              </option>
            </select>
          </div>

          {/* Button */}
          <div className="col-md-4">
            <button
              className="btn btn-primary w-100"
              onClick={onApply}
            >
              🔍 Apply Filters
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}