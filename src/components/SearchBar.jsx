export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      className="form-control"
      placeholder="🔍 Search by title or description..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}