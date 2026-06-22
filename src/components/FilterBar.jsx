export default function FilterBar({ onStatus, onMonth, onApply }) {
  return (
    <div className="d-flex gap-2 mb-3">

      <select className="form-select" onChange={(e) => onStatus(e.target.value)}>
        <option>All Status</option>
        <option>Completed</option>
        <option>Pending</option>
        <option>In Progress</option>
      </select>

      <select className="form-select" onChange={(e) => onMonth(e.target.value)}>
        <option>All Months</option>
        <option>Jan</option>
        <option>Feb</option>
        <option>Mar</option>
        <option>Apr</option>
        <option>May</option>
        <option>Jun</option>
      </select>

      <button className="btn btn-primary" onClick={onApply}>
        View
      </button>

    </div>
  );
}