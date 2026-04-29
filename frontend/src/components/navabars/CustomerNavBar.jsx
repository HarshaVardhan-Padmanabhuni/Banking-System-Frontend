// src/components/navbars/CustomerNavBar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function CustomerNavBar({ supportCount = 0 }) {
  const linkClass = ({ isActive }) => "nav-link" + (isActive ? " active" : "");

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        {/* Logo / Brand on LEFT */}
        <NavLink className="navbar-brand" to="/customer">
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
          data-bs-target="#customerNavbar"
          aria-controls="customerNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* All items on RIGHT */}
        <div className="collapse navbar-collapse" id="customerNavbar">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className={linkClass} to="/customer">
                Dashboard
              </NavLink>
            </li>

            {/* Quick Actions Dropdown */}
           

            

            {/* Support with badge */}
            <li className="nav-item">
              <NavLink className={linkClass} to="/customer/support">
                Support{" "}
                {supportCount > 0 && (
                  <span className="badge text-bg-danger ms-1">{supportCount}</span>
                )}
              </NavLink>
            </li>

            {/* Profile dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Account
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <NavLink className="dropdown-item" to="/customer/profile">
                    Profile
                  </NavLink>
                </li>
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
``