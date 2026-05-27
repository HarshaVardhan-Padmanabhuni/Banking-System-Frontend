<<<<<<< HEAD
// import { useEffect, useState } from "react";

// import { useNavigate } from "react-router-dom";

// import statements from "../../mock/statements";

// import "./customer.css";

// export default function CustomerDashboard() {

//   const navigate = useNavigate();

//   const [transactions, setTransactions] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const user = {

//     account: "1234"

//   };

//   useEffect(() => {

//     setTimeout(() => {

//       setTransactions(statements);

//       // store for statements page (PDF)

//       localStorage.setItem("transactions", JSON.stringify(statements));

//       setLoading(false);

//     }, 600);

//   }, []);

//   return (

//     <div className="dashboard-container fade-in">

//       {/* BALANCE */}

//       <div className="balance-card slide-up">

//         <div>

//           <p className="label">Available Balance</p>

//           <h1 className="balance">₹ 45,320.00</h1>

//           <p className="account-type">

//             Savings Account • ****{user.account}

//           </p>

//         </div>

//       </div>

//       {/* ACTIONS */}

//       <div className="actions-container slide-up delay-1">

//         <button onClick={() => navigate("/customer/deposits")} className="action-btn">Deposit</button>

//         <button onClick={() => navigate("/customer/withdraw")} className="action-btn">Withdraw</button>

//         <button onClick={() => navigate("/customer/transfer")} className="action-btn">Transfer</button>

//         <button onClick={() => navigate("/customer/fixed-deposit")} className="action-btn">Fixed Deposit</button>

//         <button onClick={() => navigate("/customer/recurring-deposit")} className="action-btn">Recurring Deposit</button>

//         <button onClick={() => navigate("/customer/statements")} className="action-btn">Statements</button>

//       </div>

//       {/* TRANSACTIONS */}

//       <div className="transactions slide-up delay-2">

//         <h3>Recent Transactions</h3>

//         {loading ? (

//           <p>Loading transactions...</p>

//         ) : transactions.length === 0 ? (

//           <p>No transactions found</p>

//         ) : (

//           transactions.map((tx, index) => {

//             const isCredit = tx.credit > 0;

//             return (

//               <div className="transaction-item" key={index}>

//                 <div>

//                   <p className="title">

//                     {tx.description || tx.type}

//                   </p>

//                   <p className="date">

//                     {tx.timestamp

//                       ? new Date(tx.timestamp).toLocaleString()

//                       : "Invalid Date"}

//                   </p>

//                   <p className="ref">

//                     Ref: {tx.refId || "-"}

//                   </p>

//                 </div>

//                 <p className={isCredit ? "credit" : "debit"}>

//                   {isCredit

//                     ? `+ ₹ ${tx.credit}`

//                     : `- ₹ ${tx.debit}`}

//                 </p>

//               </div>

//             );

//           })

//         )}

//       </div>

//     </div>

//   );

// }


import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

import statements from "../../mock/statements";

=======
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import { formatDate } from "../../utils/formatDate";
>>>>>>> bfb824e2258214349f8bf8c88600254417810ac8
import "./customer.css";

export default function CustomerDashboard() {

  const navigate = useNavigate();
<<<<<<< HEAD

  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);

  const user = {

    name: "Harshitha",

    account: "1234"

  };

  useEffect(() => {

    setTimeout(() => {

      setTransactions(statements);

      // store for PDF

      localStorage.setItem("transactions", JSON.stringify(statements));

      setLoading(false);

    }, 600);

  }, []);

  // 🔥 PDF DOWNLOAD DIRECTLY FROM DASHBOARD

  const handleDownloadPDF = () => {

    const data = JSON.parse(localStorage.getItem("transactions")) || [];

    if (data.length === 0) {

      alert("No transactions available");

      return;

    }

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();

    // TITLE

    doc.setFontSize(18);

    doc.setTextColor(37, 99, 235);

    doc.text("IG BANK", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(11);

    doc.setTextColor(0);

    doc.text("Official Account Statement", pageWidth / 2, 22, { align: "center" });

    // LINE

    doc.line(14, 28, pageWidth - 14, 28);

    // USER DETAILS

    doc.text(`Name: ${user.name}`, 14, 40);

    doc.text(`Account No: ${user.account}`, 14, 46);

    doc.text(`Statement Period: All Transactions`, 14, 52);

    // TABLE

    autoTable(doc, {
      startY: 60,
      head: [["Date & Time", "Transaction", "Amount", "Status", "Ref ID"]],
      body: data.map(tx => {
        const isCredit = tx.credit > 0;
        return [
          tx.timestamp ? new Date(tx.timestamp).toLocaleString() : "Invalid Date",
          tx.description || tx.type,
          isCredit ? `+ ₹ ${tx.credit}` : `- ₹ ${tx.debit}`,
          tx.status,
          tx.refId || "-"
        ];
      }),
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255
      }
    });

    doc.save("bank_statement.pdf");
  };

  return (
<div className="dashboard-container fade-in">

      {/* BALANCE */}
<div className="balance-card slide-up">
<div>
<p className="label">Available Balance</p>
<h1 className="balance">₹ 45,320.00</h1>
<p className="account-type">

            Savings Account • ****{user.account}
</p>
</div>
</div>

      {/* ACTIONS */}
<div className="actions-container slide-up delay-1">
<button onClick={() => navigate("/customer/deposits")} className="action-btn">Deposit</button>
<button onClick={() => navigate("/customer/withdraw")} className="action-btn">Withdraw</button>
<button onClick={() => navigate("/customer/transfer")} className="action-btn">Transfer</button>
<button onClick={() => navigate("/customer/fixed-deposit")} className="action-btn">Fixed Deposit</button>
<button onClick={() => navigate("/customer/recurring-deposit")} className="action-btn">Recurring Deposit</button>

        {/* 🔥 THIS IS WHAT YOU WANTED */}
<button

  onClick={() => navigate("/customer/statements")}

  className="action-btn"
>

  Download Statement
</button>
</div>

      {/* TRANSACTIONS */}
<div className="transactions slide-up delay-2">
<h3>Recent Transactions</h3>

        {loading ? (
<p>Loading transactions...</p>

        ) : transactions.length === 0 ? (
<p>No transactions found</p>

        ) : (

          transactions.map((tx, index) => {

            const isCredit = tx.credit > 0;

            return (
<div className="transaction-item" key={index}>
<div>
<p className="title">

                    {tx.description || tx.type}
</p>
<p className="date">

                    {tx.timestamp

                      ? new Date(tx.timestamp).toLocaleString()

                      : "Invalid Date"}
</p>
<p className="ref">

                    Ref: {tx.refId || "-"}
</p>
</div>
<p className={isCredit ? "credit" : "debit"}>

                  {isCredit

                    ? `+ ₹ ${tx.credit}`

                    : `- ₹ ${tx.debit}`}
</p>
</div>

            );

          })

        )}
</div>
</div>

  );

}
 
=======
  const userId = localStorage.getItem("userid");
  const currentAccountNumber = localStorage.getItem("accountnumber"); // Get current account
  const [transactions, setTransactions] = useState([]);
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const filterTransactionsByAccount = (txs, accNumber) => {
    const accountNumber = String(accNumber).toLowerCase();
    return Array.isArray(txs)
      ? txs.filter((tx) => {
          const candidates = [
            String(tx.account?.accountnumber).toLowerCase(),
            String(tx.accountnumber).toLowerCase(),
            String(tx.account_number).toLowerCase(),
            String(tx.fromnumber).toLowerCase(),
            String(tx.tonumber).toLowerCase(),
            String(tx.from_number).toLowerCase(),
            String(tx.to_number).toLowerCase(),
            String(tx.fromAccount?.accountnumber).toLowerCase(),
            String(tx.toAccount?.accountnumber).toLowerCase(),
          ];
          return candidates.some((value) => value === accountNumber);
        })
      : [];
  };

  const fetchAllTransactionsForAccount = async (accNumber) => {
    const res = await API.get("/api/transactions/all");
    return filterTransactionsByAccount(res.data, accNumber);
  };

  const getTransactionDate = (tx) =>
    formatDate(tx.txntimestamp || tx.timestamp || tx.createdAt || tx.created_at || tx.date || tx.createdat);

  const getTransactionAmount = (tx) => {
    if (typeof tx.amount === "number") return tx.amount;
    if (typeof tx.amount === "string" && tx.amount.trim() !== "") return Number(tx.amount);
    if (typeof tx.credit === "number" || typeof tx.debit === "number") {
      return (tx.credit || 0) - (tx.debit || 0);
    }
    return 0;
  };

  const getTransactionDescription = (tx) =>
    tx.txntype || tx.description || tx.type || tx.transactionType || "Transaction";

  const getTransactionRef = (tx) => tx.txnid || tx.refId || tx.refid || tx.id || "-";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

      if (!userId) {
        console.error("User ID missing");
        return;
      }

      const customerRes = await API.get(`/api/customers/by-user/${userId}`);
      const customer = customerRes.data;

      const accRes = await API.get(`/accounts/customer/${customer.customerid}`);
      const accounts = accRes.data;

      if (!accounts || accounts.length === 0) return;

      const account = accounts[0];
      setAccountDetails(account);

      let txData = [];

      try {
        const txRes = await API.get("/api/transactions/statement", {
          params: {
            accountnumber: account.accountnumber,
            from: "2000-01-01T00:00:00",
            to: new Date().toISOString()
          }
        });

        txData = Array.isArray(txRes.data) ? txRes.data : [];
      } catch (e) {}

      if (txData.length === 0) {
        txData = await fetchAllTransactionsForAccount(account.accountnumber);
      }

      const sorted = txData
        .sort((a, b) => {
          const dateA = new Date(a.timestamp || a.createdAt || a.created_at || a.date || a.createdat).getTime();
          const dateB = new Date(b.timestamp || b.createdAt || b.created_at || b.date || b.createdat).getTime();
          return dateB - dateA;
        })
        .slice(0, 5);

      setTransactions(sorted);

    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container fade-in">

      <div className="balance-card slide-up">
        {accountDetails ? (
          <div>
            <p className="label">Available Balance</p>
            <h1 className="balance">₹ {accountDetails.balance}</h1>
            <p className="account-type">
              Savings Account • {accountDetails.accountnumber}
            </p>
          </div>
        ) : (
          <p>Loading balance...</p>
        )}
      </div>

      <div className="actions-container slide-up delay-1">

        <button onClick={() => navigate("/customer/transfer")} className="action-btn">
          Transfer
        </button>

        <button onClick={() => navigate("/customer/fixed-deposit")} className="action-btn">
          Fixed Deposit
        </button>

        <button onClick={() => navigate("/customer/recurring-deposit")} className="action-btn">
          Recurring Deposit
        </button>

        <button onClick={() => navigate("/customer/statements")} className="action-btn">
          Download Statement
        </button>

        <button onClick={() => navigate("/customer/cards")} className="action-btn">
          Cards
        </button>

      </div>

      <div className="transactions slide-up delay-2">
        <h3>Recent Transactions</h3>

        {loading ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions found</p>
        ) : (
          transactions.map((tx, index) => {

            const status = (tx.status || "").toUpperCase();

            let amount = getTransactionAmount(tx);
            let isDebit = false;

            if (tx.type === "TRANSFER" || tx.txntype === "TRANSFER") {
              // Check if the transfer is FROM current account (debit) or TO current account (credit)
              const fromAccounts = [
                String(tx.fromnumber || "").toLowerCase(),
                String(tx.from_number || "").toLowerCase(),
                String(tx.fromAccount?.accountnumber || "").toLowerCase(),
                String(tx.account?.accountnumber || "").toLowerCase(),
              ];
              
              if (fromAccounts.some(acc => acc === String(currentAccountNumber || "").toLowerCase())) {
                isDebit = true; // Money went out
              } else {
                isDebit = false; // Money came in
              }
            } else if (tx.txntype === "WITHDRAW") {
              isDebit = true;
            } else if (tx.txntype === "DEPOSIT") {
              isDebit = false;
            }

            return (
              <div className="transaction-item" key={index}>
                <div>
                  <p className="title">{getTransactionDescription(tx)}</p>
                  <p className="date">{getTransactionDate(tx)}</p>
                  <p className="ref">Ref: {getTransactionRef(tx)}</p>
                </div>

                <p
                  className={
                    status === "FAILED"
                      ? "failed"
                      : isDebit
                      ? "debit"
                      : "credit"
                  }
                >
                  {status === "FAILED"
                    ? `FAILED ₹ ${Math.abs(amount)}`
                    : isDebit
                    ? `- ₹ ${Math.abs(amount)}`
                    : `+ ₹ ${amount}`}
                </p>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
>>>>>>> bfb824e2258214349f8bf8c88600254417810ac8
