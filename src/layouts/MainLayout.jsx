import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="d-flex min-vh-100 bg-light">

      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          background: "#212529",
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {children}
      </div>

    </div>
  );
}