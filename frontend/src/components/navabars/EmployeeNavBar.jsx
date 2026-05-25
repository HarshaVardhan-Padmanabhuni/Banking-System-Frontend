// src/components/navbars/EmployeeNavBar.jsx

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function EmployeeNavBar() {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `nav-link text-dark px-3 ${isActive ? "fw-bold border-bottom border-2 border-dark" : ""}`;

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container-fluid">
        {/* BRAND */}
        <NavLink className="navbar-brand fw-bold text-dark" to="/employee">
          <img src="https://cdn.corenexis.com/files/c/5699658720.png" alt="Bank" width="150" height="70" className="d-inline-block align-text-top"
          />
        </NavLink>

        {/* TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#employeeNavbar"
          aria-controls="employeeNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* NAV LINKS */}
        <div className="collapse navbar-collapse" id="employeeNavbar">
          <ul className="navbar-nav ms-auto align-items-center">

            <li className="nav-item">
              <NavLink className={linkClass} to="/employee">
                Dashboard
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={linkClass} to="/employee/customers">
                Customers
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={linkClass} to="/employee/accounts">
                Accounts
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={linkClass} to="/employee/transactions">
                Transactions
              </NavLink>
            </li>

            {/* PROFILE / LOGOUT */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle fw-bold text-dark"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Employee
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button
                    className="dropdown-item text-danger"
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