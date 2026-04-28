import { NavLink, useNavigate } from "react-router-dom";

import "./CustomerNavBar.css";

export default function CustomerNavBar({ supportCount = 0 }) {

  const linkClass = ({ isActive }) =>

    "nav-link" + (isActive ? " active" : "");

  const handleLogout = () => {

    localStorage.removeItem("isLoggedIn");

    navigate("/login");

  };

  return (
<nav className="navbar navbar-expand-lg bg-body-tertiary">
<div className="container-fluid">

        {/* Logo */}
<NavLink className="navbar-brand" to="/customer">
<img

            src="https://cdn.corenexis.com/files/c/5699658720.png"

            alt="Bank"

            width="150"

            height="60"

            className="d-inline-block align-text-top"

          />
</NavLink>

        {/* Toggle (mobile) */}
<button

          className="navbar-toggler"

          type="button"

          data-bs-toggle="collapse"

          data-bs-target="#customerNavbar"
>
<span className="navbar-toggler-icon"></span>
</button>

        {/* Right side */}
<div className="collapse navbar-collapse" id="customerNavbar">
<ul className="navbar-nav ms-auto">

            {/* Dashboard */}
<li className="nav-item">
<NavLink className={linkClass} to="/customer">

                Dashboard
</NavLink>
</li>


            {/* Support */}
<li className="nav-item">
<NavLink className={linkClass} to="/customer/support">

                Support{" "}

                {supportCount > 0 && (
<span className="badge text-bg-danger ms-1">

                    {supportCount}
</span>

                )}
</NavLink>
</li>

            {/* Profile Dropdown */}
<li className="nav-item dropdown">
<a

                className="nav-link dropdown-toggle"

                href="#"

                role="button"

                data-bs-toggle="dropdown"
>

                Account
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
<button className="dropdown-item" type="button" onClick={handleLogout}>

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
 