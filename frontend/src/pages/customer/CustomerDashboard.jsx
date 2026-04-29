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

import "./customer.css";

export default function CustomerDashboard() {

  const navigate = useNavigate();

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
 