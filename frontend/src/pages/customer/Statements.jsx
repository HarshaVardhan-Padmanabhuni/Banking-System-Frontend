import { useState, useEffect } from "react";
<<<<<<< HEAD
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./customer.css";
import statements from "../../mock/statements";
export default function Statements() {
 const [transactions, setTransactions] = useState([]);
 const [filtered, setFiltered] = useState([]);
 const [fromDate, setFromDate] = useState("");
 const [toDate, setToDate] = useState("");
 const user = {
   name: "Harshitha",
   account: "1234"
 };
 useEffect(() => {
   const data = JSON.parse(localStorage.getItem("transactions")) || [];
   const initialData = data.length ? data : statements;
   if (!data.length) {
     localStorage.setItem("transactions", JSON.stringify(statements));
   }
   setTransactions(initialData);
   setFiltered(initialData);
 }, []);
 // 🎯 FILTER FUNCTION
 const handleFilter = () => {
   const filteredData = transactions.filter(tx => {
     const txDate = new Date(tx.timestamp || tx.time);
     return (
       (!fromDate || txDate >= new Date(fromDate)) &&
       (!toDate || txDate <= new Date(toDate))
     );
   });
   setFiltered(filteredData);
 };
 // 🎯 PDF DOWNLOAD
 const handleDownloadPDF = () => {
  const doc = new jsPDF();

  // 🏦 Bank Title
  doc.setFontSize(20);
  doc.text("IG Bank Statement", 14, 20);

  // 👤 Customer Details
  doc.setFontSize(12);
  doc.text(`Name: ${user.name}`, 14, 35);
  doc.text(`Account No: ****${user.account}`, 14, 42);

  // 📅 Date Range
  doc.text(
    `Period: ${fromDate || "Beginning"} to ${toDate || "Today"}`,
    14,
    50
  );

  // 📊 Transactions Table
  autoTable(doc, {
    startY: 60,
    head: [["Date & Time", "Type", "Description", "Amount (INR)", "Reference ID"]],
    body: filtered.map(tx => {
      const txDate = new Date(tx.timestamp || tx.time);
      const amountValue = tx.amount ?? ((tx.credit || 0) - (tx.debit || 0));
      const formattedAmount = amountValue >= 0 ? `Rs ${amountValue}` : `- Rs ${Math.abs(amountValue)}`;
      return [
        txDate.toLocaleString(),
        tx.type || tx.description || "N/A",
        tx.description || tx.toAccount || tx.fromAccount || "N/A",
        formattedAmount,
        tx.referenceId ?? tx.refId ?? ""
      ];
    }),
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [22, 160, 133], textColor: 255, halign: "center" },
    bodyStyles: { halign: "center" }
  });

  // 📌 Footer
  doc.setFontSize(10);
  doc.text(
    "This is a system-generated statement. For queries, contact IG Bank support.",
    105,
    doc.internal.pageSize.height - 10,
    { align: "center" }
  );

  doc.save("bank_statement.pdf");
};
 return (
<div className="dashboard-container">
<h2>Bank Statement</h2>
     {/* FILTERS */}
<div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
<input
         type="date"
         value={fromDate}
         onChange={(e) => setFromDate(e.target.value)}
       />
<input
         type="date"
         value={toDate}
         onChange={(e) => setToDate(e.target.value)}
       />
<button onClick={handleFilter}>Apply</button>
<button onClick={handleDownloadPDF}>Download PDF</button>
</div>
     {/* PREVIEW TABLE */}
<div className="transactions">
       {filtered.length === 0 ? (
         <p>No transactions found</p>
       ) : filtered.map((tx, index) => {
         const txDate = new Date(tx.timestamp || tx.time);
         const amountValue = tx.amount ?? ((tx.credit || 0) - (tx.debit || 0));
         const formattedAmount = amountValue >= 0 ? `Rs ${amountValue}` : `- Rs ${Math.abs(amountValue)}`;
         return (
<div key={index} className="transaction-item">
<div>
<p>{tx.type || tx.description || "Transaction"}</p>
<p className="date">{txDate.toLocaleString()}</p>
</div>
<p>{formattedAmount}</p>
</div>
         );
       })}
</div>
</div>
 );
=======
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import API from "../../api/api";
import { formatDate } from "../../utils/formatDate";
import "./customer.css";

export default function Statements() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [accountDetails, setAccountDetails] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);

  const [fds, setFds] = useState([]);
  const [rds, setRds] = useState([]);
  const accountId = localStorage.getItem("accountid");

  const accountNumber = localStorage.getItem("accountnumber");

  const filterTransactionsByAccount = (txs, accNumber) => {
    const acc = String(accNumber || "").toLowerCase();

    return Array.isArray(txs)
      ? txs.filter((tx) => {
          const candidates = [
            String(tx?.account?.accountnumber || "").toLowerCase(),
            String(tx?.accountnumber || "").toLowerCase(),
            String(tx?.account_number || "").toLowerCase(),
            String(tx?.fromnumber || "").toLowerCase(),
            String(tx?.tonumber || "").toLowerCase(),
            String(tx?.from_number || "").toLowerCase(),
            String(tx?.to_number || "").toLowerCase(),
            String(tx?.fromAccount?.accountnumber || "").toLowerCase(),
            String(tx?.toAccount?.accountnumber || "").toLowerCase(),
          ];
          return candidates.some((v) => v === acc);
        })
      : [];
  };

  const getTransactionDate = (tx) =>
    formatDate(
      tx?.txntimestamp ||
        tx?.timestamp ||
        tx?.createdAt ||
        tx?.created_at ||
        tx?.date ||
        tx?.createdat
    );

  const getTransactionAmount = (tx) => {
    if (typeof tx?.amount === "number") return tx.amount;
    if (typeof tx?.amount === "string" && tx.amount.trim() !== "")
      return Number(tx.amount);
    if (typeof tx?.credit === "number" || typeof tx?.debit === "number") {
      return (tx.credit || 0) - (tx.debit || 0);
    }
    return 0;
  };

  const getTransactionDescription = (tx) =>
    tx?.txntype ||
    tx?.description ||
    tx?.type ||
    tx?.transactionType ||
    "Transaction";

  const getTransactionRef = (tx) =>
    tx?.txnid || tx?.refId || tx?.refid || tx?.id || "";

  const fetchStatement = async () => {
    try {
      const res = await API.get("/api/transactions/all");
      const allTx = Array.isArray(res.data) ? res.data : [];
      const myTx = filterTransactionsByAccount(allTx, accountNumber);

      setTransactions(myTx);
      setFiltered(myTx);

      if (myTx.length > 0) {
        const first = myTx[0];
        if (first?.account) setAccountDetails(first.account);
        if (first?.account?.customer)
          setCustomerDetails(first.account.customer);
      }
    } catch (err) {
      console.error("Statement Error:", err);
      setTransactions([]);
      setFiltered([]);
    }
  };

 
  const fetchFDs = async () => {
    try {
      const res = await API.get(`/deposits/fixed/account/${accountId}`);
      setFds(res.data);
    } catch (err) {
      console.error("FD fetch error:", err);
    }
  };


  const fetchRDs = async () => {
    try {
      const res = await API.get(`/deposits/recurring/account/${accountId}`);
      setRds(res.data);
    } catch (err) {
      console.error("RD fetch error:", err);
    }
  };

  useEffect(() => {
    fetchStatement();
    fetchFDs(); 
    fetchRDs(); 
  }, []);

  const handleFilter = () => {
    const filteredData = transactions.filter((tx) => {
      const raw =
        tx?.txntimestamp ||
        tx?.timestamp ||
        tx?.createdAt ||
        tx?.created_at ||
        tx?.date ||
        tx?.createdat;

      const txDate = raw ? new Date(raw) : null;
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      if (!txDate || isNaN(txDate.getTime())) return false;

      const toEnd = to ? new Date(to.setHours(23, 59, 59, 999)) : null;

      return (!from || txDate >= from) && (!toEnd || txDate <= toEnd);
    });

    setFiltered(filteredData);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    let yPosition = 20;
    const lineHeight = 7;
    const margin = 14;

    const money = (v) => {
      if (v === null || v === undefined || v === "") return "N/A";
      const n = Number(v);
      if (Number.isNaN(n)) return String(v);
      return `Rs. ${Math.abs(n).toLocaleString("en-IN")}`;
    };

    doc.setFontSize(20);
    doc.text("IG Bank Statement", margin, yPosition);
    yPosition += 12;

    doc.setFontSize(11);

    // CUSTOMER DETAILS SECTION (RESTORED + EXTENDED)
    doc.text("--- Customer Details ---", margin, yPosition);
    yPosition += lineHeight + 2;

    

    if (customerDetails?.email) {
      doc.text(`Email: ${customerDetails.email}`, margin, yPosition);
      yPosition += lineHeight;
    }

    if (customerDetails?.phone) {
      doc.text(`Phone: ${customerDetails.phone}`, margin, yPosition);
      yPosition += lineHeight;
    }

    if (customerDetails?.address) {
      doc.text(`Address: ${customerDetails.address}`, margin, yPosition);
      yPosition += lineHeight;
    }

    if (customerDetails?.kycstatus) {
      doc.text(`KYC Status: ${customerDetails.kycstatus}`, margin, yPosition);
      yPosition += lineHeight;
    }

    // Account No + Balance (from tx.account.*)
    doc.text(
      `Account Number: ${accountDetails?.accountnumber || accountNumber || "N/A"}`,
      margin,
      yPosition
    );
    yPosition += lineHeight;

    doc.text(
      `Current Balance: ${accountDetails?.balance ?? "N/A"}`,
      margin,
      yPosition
    );
    yPosition += lineHeight;

    yPosition += 3;

    const today = new Date().toISOString().split("T")[0];

const periodText = `Period: ${fromDate || today} to ${toDate || today}`;


    doc.text(periodText, margin, yPosition);
    yPosition += 8;

    // Transactions Table (same)
    autoTable(doc, {
      startY: yPosition,
      head: [["Date & Time", "Type", "Amount", "Transaction ID"]],
      body: filtered.map((tx) => {
        const txDate = getTransactionDate(tx);
        const amount = getTransactionAmount(tx);
        const amountStr = money(amount);
        return [
          txDate,
          getTransactionDescription(tx),
          amountStr,
          String(getTransactionRef(tx)),
        ];
      }),
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    // ADD FD TABLE AFTER TRANSACTIONS
    let nextY = (doc.lastAutoTable?.finalY || yPosition) + 10;

    doc.setFontSize(13);
    doc.text("Fixed Deposits", margin, nextY);
    nextY += 6;

    autoTable(doc, {
      startY: nextY,
      head: [["FD ID", "Principal", "Rate", "Tenure (M)", "Maturity", "Maturity Date", "Status"]],
      body: (Array.isArray(fds) ? fds : []).map((fd) => [
        String(fd?.fdid ?? ""),
        money(fd?.principalamount),
        fd?.interestrate !== undefined && fd?.interestrate !== null ? `${fd.interestrate}%` : "N/A",
        String(fd?.tenuremonths ?? "N/A"),
        money(fd?.maturityamount),
        String(fd?.maturitydate ?? "N/A"),
        String(fd?.status ?? "N/A"),
      ]),
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [52, 73, 94] },
    });

    // ADD RD TABLE AFTER FD
    nextY = (doc.lastAutoTable?.finalY || nextY) + 10;

    doc.setFontSize(13);
    doc.text("Recurring Deposits", margin, nextY);
    nextY += 6;

    autoTable(doc, {
      startY: nextY,
      head: [["RD ID", "Monthly", "Rate", "Tenure (M)", "Start Date", "Next Due", "Paid Months", "Status"]],
      body: (Array.isArray(rds) ? rds : []).map((rd) => [
        String(rd?.rdid ?? ""),
        money(rd?.monthlyamount),
        rd?.interestrate !== undefined && rd?.interestrate !== null ? `${rd.interestrate}%` : "N/A",
        String(rd?.tenuremonths ?? "N/A"),
        String(rd?.startdate ?? "N/A"),
        String(rd?.nextduedate ?? "N/A"),
        String(rd?.paidmonths ?? "N/A"),
        String(rd?.status ?? "N/A"),
      ]),
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [142, 68, 173] },
    });

    doc.save("bank_statement.pdf");
  };

  return (
    <div className="dashboard-container">
      <button onClick={() => navigate("/customer-dashboard")}>
        ← Back to Dashboard
      </button>

      <h2>Bank Statement</h2>

      {/* RESTORED FILTERS + PDF DOWNLOAD BUTTON */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
        <button onClick={handleFilter}>Apply</button>
        <button onClick={handleDownloadPDF}>Download PDF</button>
      </div>

      {/* ORIGINAL TRANSACTIONS */}
      <div className="transactions">
        {filtered.length === 0 ? (
          <p>No transactions found</p>
        ) : (
          filtered.map((tx, index) => {
            const amount = getTransactionAmount(tx);

            return (
              <div key={index} className="transaction-item">
                <div>
                  <p>{getTransactionDescription(tx)}</p>
                  <p className="date">{getTransactionDate(tx)}</p>
                  <p className="ref">
                    Transaction ID: {getTransactionRef(tx)}
                  </p>
                </div>

                <p className={amount >= 0 ? "credit" : "debit"}>
                  ₹ {Math.abs(amount).toLocaleString("en-IN")}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* ADDED FD SECTION */}
      <div className="transactions">
        <h3>Fixed Deposits</h3>
        {fds.length === 0 ? (
          <p>No FD found</p>
        ) : (
          fds.map((fd) => (
            <div key={fd.fdid} className="transaction-item">
              <div>
                <p>Fixed Deposit</p>
                <p className="date">Maturity: {fd.maturitydate}</p>
                <p className="ref">Rate: {fd.interestrate}%</p>
              </div>
              <p className="credit">₹ {fd.principalamount}</p>
            </div>
          ))
        )}
      </div>

      {/* ADDED RD SECTION */}
      <div className="transactions">
        <h3>Recurring Deposits</h3>
        {rds.length === 0 ? (
          <p>No RD found</p>
        ) : (
          rds.map((rd) => (
            <div key={rd.rdid} className="transaction-item">
              <div>
                <p>Recurring Deposit</p>
                <p className="date">Next Due: {rd.nextduedate}</p>
                <p className="ref">Paid: {rd.paidmonths}</p>
              </div>
              <p className="credit">₹ {rd.monthlyamount}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
>>>>>>> bfb824e2258214349f8bf8c88600254417810ac8
}