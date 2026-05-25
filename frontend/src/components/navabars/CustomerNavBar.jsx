import { NavLink, useNavigate } from "react-router-dom";
import API from "../../api/api";
import "./CustomerNavBar.css";
 
export default function CustomerNavBar({ supportCount = 0 }) {
 
  const navigate = useNavigate();
 
  const name = localStorage.getItem("name");
 
  const linkClass = ({ isActive }) =>
    "nav-link" + (isActive ? " active" : "");
 
  // 🔥 LOGOUT
  const handleLogout = () => {
 
    // CLEAR ALL SESSION DATA
    localStorage.clear();
 
    // REMOVE JWT HEADER
    delete API.defaults.headers.common["Authorization"];
 
    // REDIRECT TO LOGIN
    navigate("/login");
  };
 
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
 
      <div className="container-fluid">
 
        {/* LOGO */}
        <NavLink className="navbar-brand" to="/customer">
          <img
            src="https://cdn.corenexis.com/files/c/5699658720.png"
            alt="Bank"
            width="150"
            height="70"
            className="d-inline-block align-text-top"
          />
        </NavLink>
 
        {/* TOGGLE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#customerNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
 
        {/* RIGHT SECTION */}
        <div
          className="collapse navbar-collapse"
          id="customerNavbar"
        >
 
          <ul className="navbar-nav ms-auto">
 
            {/* DASHBOARD */}
            <li className="nav-item">
              <NavLink
                className={linkClass}
                to="/customer"
                end
              >
                Dashboard
              </NavLink>
            </li>
 
            {/* SUPPORT */}
            <li className="nav-item">
              <NavLink
                className={linkClass}
                to="/customer/support"
              >
                Support
              </NavLink>
            </li>
 
            {/* PROFILE DROPDOWN */}
            <li className="nav-item dropdown">
 
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
              >
                {name || "Account"}
              </a>
 
              <ul className="dropdown-menu dropdown-menu-end">
 
                <li>
                  <NavLink
                    className="dropdown-item"
                    to="/customer/profile"
                  >
                    Profile
                  </NavLink>
                </li>
 
                <li>
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
 
              </ul>
 
            </li>
 
          </ul>
 
        </div>
 
      </div>
 
    </nav>
  );
}