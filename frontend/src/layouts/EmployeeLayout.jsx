// src/layouts/EmployeeLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import EmployeeNavBar from "../components/navabars/EmployeeNavBar";

export default function EmployeeLayout() {
  return (
    <>
      <EmployeeNavBar pendingRequests={5} openTickets={3} />
      <div className="container mt-3">
        <Outlet />
      </div>
    </>
  );
}