// src/layouts/CustomerLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import CustomerNavBar from "../components/navabars/CustomerNavBar";

export default function CustomerLayout() {
  return (
    <>
      <CustomerNavBar supportCount={2} />
      <div className="container mt-3">
        <Outlet />
      </div>
    </>
  );
}