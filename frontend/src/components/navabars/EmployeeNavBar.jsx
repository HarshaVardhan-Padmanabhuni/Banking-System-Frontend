// src/components/navbars/EmployeeNavBar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function EmployeeNavBar({
  pendingRequests = 0,
  openTickets = 0,
  onSearch = () => {},
}) {
  // ✅ Black text + bold + active highlight
  const linkClass = ({ isActive }) =>
    `nav-link text-dark ${isActive ? "fw-bold active" : ""}`;

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container-fluid">
        {/* Logo / Brand on LEFT */}
        <NavLink className="navbar-brand" to="/employee">
          <img
            src="https://cdn.corenexis.com/files/c/5699658720.png"
            alt="Bank"
            width="150"
            height="70"
            className="d-inline-block align-text-top"
          />
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
                Account Requests
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
                Tickets
                {openTickets > 0 && (
                  <span className="badge text-bg-danger ms-1">
                    {openTickets}
                  </span>
                )}
              </NavLink>
            </li>

            {/* Profile dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle text-dark fw-bold"
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
