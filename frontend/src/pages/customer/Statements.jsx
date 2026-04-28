import { useState, useEffect } from "react";
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
}