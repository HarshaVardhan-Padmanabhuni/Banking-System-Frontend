// src/App.jsx

import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Navigate } from "react-router-dom";

import CustomerLayout from "./layouts/CustomerLayout";

import EmployeeLayout from "./layouts/EmployeeLayout";

import Login from "./pages/auth/Login";

import Register from "./pages/auth/Register";

import Statements from "./pages/customer/Statements";

// customer pages
import Profile from "./pages/customer/Profile";

import  CustomerDashboard  from "./pages/customer/CustomerDashboard";

import Deposits from "./pages/customer/Deposits";

import Withdraw from "./pages/customer/Withdraw";

import Transfer from "./pages/customer/Transfer";

import FixedDeposit from "./pages/customer/FixedDeposit";

import RecurringDeposit from "./pages/customer/RecurringDeposit";

import Support from "./pages/customer/Support";

// employee pages

import EmployeeDashboard from "./pages/employee/EmployeeDashboard";

import Customers from "./pages/employee/Customers";

import AccountRequests from "./pages/employee/AccountRequests";

import ManageAccounts from "./pages/employee/ManageAccounts";

import Tickets from "./pages/employee/Tickets";

export default function App() {

  const ProtectedRoute = ({ children }) => {

  const isLoggedIn = localStorage.getItem("isLoggedIn");

  return isLoggedIn ? children : <Navigate to="/login" />;

};

  return (
<BrowserRouter>
<Routes>

        {/* AUTH ROUTES - at top level */}
<Route path="/register" element={<Register />} />
<Route path="/login" element={<Login />} />

        {/* CUSTOMER AREA */}
<Route

          path="/customer"

          element={
<ProtectedRoute>
<CustomerLayout />
</ProtectedRoute>

          }
>
<Route path="statements" element={<Statements />} />  
<Route index element={<CustomerDashboard />} />
<Route path="deposits" element={<Deposits />} />
<Route path="withdraw" element={<Withdraw />} />
<Route path="transfer" element={<Transfer />} />
<Route path="fixed-deposit" element={<FixedDeposit />} />
<Route path="recurring-deposit" element={<RecurringDeposit />} />
<Route path="support" element={<Support />} />
<Route path="profile" element={<Profile />} />
</Route>

        {/* EMPLOYEE AREA */}
<Route path="/employee" element={<EmployeeLayout />}>
<Route index element={<EmployeeDashboard />} />
<Route path="customers" element={<Customers />} />
<Route path="account-requests" element={<AccountRequests />} />
<Route path="manage-accounts" element={<ManageAccounts />} />
<Route path="tickets" element={<Tickets />} />
</Route>
</Routes>
</BrowserRouter>

  );

}
 