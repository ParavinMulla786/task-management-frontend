import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <div className="container-fluid">
      <div className="row">

        {/* SIDEBAR (20-25%) */}
        <div className="col-md-3 col-lg-2 bg-dark min-vh-100 p-0">
          <Sidebar />
        </div>

        {/* MAIN CONTENT (75-80%) */}
        <div className="col-md-9 col-lg-10 bg-light min-vh-100">

          <Navbar />

          <div className="p-3">
            <AppRoutes />
          </div>

        </div>

      </div>
    </div>
  );
}

export default App;