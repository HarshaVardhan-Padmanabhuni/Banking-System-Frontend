// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import CustomerLayout from "./layouts/CustomerLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";

// customer pages
import { CustomerDashboard } from "./pages/customer/CustomerDashboard";
import { Deposit } from "./pages/customer/Deposits";
import Withdraw from "./pages/customer/Withdraw";
import Transfer from "./pages/customer/Transfer";
import { FixedDeposit } from "./pages/customer/FixedDeposit";
import RecurringDeposit from "./pages/customer/RecurringDeposit";
import Support from "./pages/customer/Support";

// employee pages
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import Customers from "./pages/employee/Customers";
import AccountRequests from "./pages/employee/AccountRequests";
import ManageAccounts from "./pages/employee/ManageAccounts";
import Tickets from "./pages/employee/Tickets";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* CUSTOMER AREA */}
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<CustomerDashboard />} />
          <Route path="deposit" element={<Deposit />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="transfer" element={<Transfer />} />
          <Route path="fixed-deposit" element={<FixedDeposit />} />
          <Route path="recurring-deposit" element={<RecurringDeposit />} />
          <Route path="support" element={<Support />} />
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