const AdminTopbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
      <div className="container-fluid">
        <h4 className="fw-bold mb-0">Dashboard</h4>
        <div className="d-flex align-items-center">
          <button className="btn btn-light position-relative me-3">
            <i className="bi bi-bell"></i>
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
          </button>
          <span className="fw-semibold me-3">Admin</span>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminTopbar;
