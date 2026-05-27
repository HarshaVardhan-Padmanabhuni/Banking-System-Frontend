<<<<<<< HEAD
// src/layouts/EmployeeLayout.jsx
import React from "react";
=======
>>>>>>> bfb824e2258214349f8bf8c88600254417810ac8
import { Outlet } from "react-router-dom";
import EmployeeNavBar from "../components/navabars/EmployeeNavBar";

export default function EmployeeLayout() {
  return (
    <>
<<<<<<< HEAD
      <EmployeeNavBar pendingRequests={5} openTickets={3} />
      <div className="container mt-3">
=======
      <EmployeeNavBar />

      {/*  THIS IS REQUIRED */}
      <div className="container-fluid mt-3">
>>>>>>> bfb824e2258214349f8bf8c88600254417810ac8
        <Outlet />
      </div>
    </>
  );
}