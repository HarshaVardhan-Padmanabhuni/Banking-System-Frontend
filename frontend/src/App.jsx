// src/App.jsx
<<<<<<< HEAD

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
 
=======
import React from "react";
import { Route,BrowserRouter,Routes,Navigate } from "react-router-dom";


// ================= LAYOUTS =================
import CustomerLayout from "./layouts/CustomerLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";

// ================= AUTH =================
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ================= CUSTOMER PAGES (UNCHANGED) =================
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import Profile from "./pages/customer/Profile";
import Statements from "./pages/customer/Statements";
import Deposits from "./pages/customer/Deposits";
import Withdraw from "./pages/customer/Withdraw";
import Transfer from "./pages/customer/Transfer";
import FixedDeposit from "./pages/customer/FixedDeposit";
import RecurringDeposit from "./pages/customer/RecurringDeposit";
import Support from "./pages/customer/Support";
import Cards from "./pages/customer/Cards";
import OpenAccount from "./pages/customer/OpenAccount";


// ================= EMPLOYEE PAGES =================
import DashboardPage from "./features/dashboard/pages/DashboardPage";

// ---- Customers
import CustomerListPage from "./features/customers/pages/CustomerListPage";
import CustomerDetailsPage from "./features/customers/pages/CustomerDetailsPage";
import CustomerEditPage from "./features/customers/pages/CustomerEditPage";
import CustomerStatusPage from "./features/customers/pages/CustomerStatusPage";
import CustomerKycPage from "./features/customers/pages/CustomerKycPage";
import CustomerAccountsPage from "./features/customers/pages/CustomerAccountsPage";

// ---- Accounts
import AccountListPage from "./features/accounts/pages/AccountListPage";
import OpenAccountPage from "./features/accounts/pages/OpenAccountPage";
import AccountDetailsPage from "./features/accounts/pages/AccountDetailsPage";

// ---- Transactions
import TransactionsListPage from "./features/transactions/pages/TransactionsListPage";
import TransactionDetailsPage from "./features/transactions/pages/TransactionDetailsPage";
import DepositPage from "./features/transactions/pages/DepositPage";
import WithdrawPage from "./features/transactions/pages/WithdrawPage";
import TransferPage from "./features/transactions/pages/TransferPage";
import StatementPage from "./features/transactions/pages/StatementPage";

export default function App() {

  // ✅ Simple auth guard (same logic you already use)
  const ProtectedRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    return isLoggedIn ? children : <Navigate to="/login" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* ================= AUTH ROUTES ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/open-account"
          element={
            <ProtectedRoute>
              <OpenAccount />
            </ProtectedRoute>
          }
        />

        {/* ================= CUSTOMER AREA (UNCHANGED) ================= */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CustomerDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="deposits" element={<Deposits />} />
          <Route path="withdraw" element={<Withdraw />} />
          <Route path="transfer" element={<Transfer />} />
          <Route path="fixed-deposit" element={<FixedDeposit />} />
          <Route path="recurring-deposit" element={<RecurringDeposit />} />
          <Route path="support" element={<Support />} />
          <Route path="statements" element={<Statements />} />
          <Route path="cards" element={<Cards />} />    
 
        </Route>

        {/* ================= EMPLOYEE AREA ================= */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute>
              <EmployeeLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<DashboardPage />} />

          {/* Customers */}
          <Route path="customers" element={<CustomerListPage />} />
          <Route path="customers/:customerId" element={<CustomerDetailsPage />} />
          <Route path="customers/:customerId/edit" element={<CustomerEditPage />} />
          <Route path="customers/:customerId/status" element={<CustomerStatusPage />} />
          <Route path="customers/:customerId/kyc" element={<CustomerKycPage />} />
          <Route
            path="customers/:customerId/accounts"
            element={<CustomerAccountsPage />}
          />

          {/* Accounts */}
          <Route path="accounts" element={<AccountListPage />} />
          <Route
               path="/employee/customers/:customerId/accounts/open"
              element={<OpenAccountPage />}
          />
          <Route path="accounts/:accountId" element={<AccountDetailsPage />} />

          {/* Transactions */}
          <Route path="transactions" element={<TransactionsListPage />} />
          <Route path="transactions/:id" element={<TransactionDetailsPage />} />
          <Route path="transactions/deposit" element={<DepositPage />} />
          <Route path="transactions/withdraw" element={<WithdrawPage />} />
          <Route path="transactions/transfer" element={<TransferPage />} />
          <Route path="transactions/statement" element={<StatementPage />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
>>>>>>> bfb824e2258214349f8bf8c88600254417810ac8
