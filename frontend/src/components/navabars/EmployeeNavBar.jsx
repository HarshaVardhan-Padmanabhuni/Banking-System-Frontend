// src/components/navbars/EmployeeNavBar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function EmployeeNavBar({
  pendingRequests = 0,
  openTickets = 0,
  onSearch = () => {},
}) {
  const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
      <div className="container-fluid">
        {/* Logo / Brand on LEFT */}
        <NavLink className="navbar-brand" to="/employee">
          <img
            src="https://cdn.corenexis.com/files/c/5699658720.png"
            alt="Bank"
            width="120"
            height="80"
            className="d-inline-block align-text-top"
          />{" "}
          Employee
        </NavLink>

        {/* Mobile toggler */}
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

        <div className="collapse navbar-collapse" id="employeeNavbar">
          {/* LEFT inside collapse: Search */}
          <form className="d-flex mt-2 mt-lg-0" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search customer..."
              aria-label="Search"
              onChange={(e) => onSearch(e.target.value)}
            />
          </form>

          {/* RIGHT items */}
          <ul className="navbar-nav ms-auto">
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
              <NavLink className={linkClass} to="/employee/account-requests">
                Account Requests{" "}
                {pendingRequests > 0 && (
                  <span className="badge text-bg-warning ms-1">
                    {pendingRequests}
                  </span>
                )}
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={linkClass} to="/employee/manage-accounts">
                Manage Accounts
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={linkClass} to="/employee/tickets">
                Tickets{" "}
                {openTickets > 0 && (
                  <span className="badge text-bg-danger ms-1">{openTickets}</span>
                )}
              </NavLink>
            </li>

            {/* Tools dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Tools
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <NavLink className="dropdown-item" to="/employee/reports">
                    Reports
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/employee/settings">
                    Settings
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* Profile */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Admin
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button className="dropdown-item" type="button">
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