import { NavLink } from "react-router-dom";
import { HouseDoor, People, Shop, Bag, CreditCard } from "react-bootstrap-icons";

const AdminSidebar = () => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark vh-100 position-fixed" style={{ width: "250px" }}>
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span className="fs-4">Salon Admin</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink to="/admin/dashboard" className="nav-link text-white" activeclassname="active">
            <HouseDoor className="me-2" /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/users" className="nav-link text-white">
            <People className="me-2" /> Users
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/salons" className="nav-link text-white">
            <Shop className="me-2" /> Salons
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/products" className="nav-link text-white">
            <Bag className="me-2" /> Products
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/payments" className="nav-link text-white">
            <CreditCard className="me-2" /> Payments
          </NavLink>
        </li>
      </ul>
      <hr />
      <div className="dropdown">
        <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="" width="32" height="32" className="rounded-circle me-2" />
          <strong>Admin</strong>
        </a>
        <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
          <li><a className="dropdown-item" href="#">Profile</a></li>
          <li><hr className="dropdown-divider" /></li>
          <li><a className="dropdown-item" href="#" onClick={() => localStorage.clear()}>Sign out</a></li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
