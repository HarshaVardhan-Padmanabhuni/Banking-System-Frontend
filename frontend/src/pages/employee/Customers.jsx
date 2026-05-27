<<<<<<< HEAD
export default function Customers() {
    return (
        <>
            <div className="container mt-5 pt-5 w-50">                  
                <h2>Customers</h2>                  
                <p>Feature coming soon...</p>
            </div>
        </>
    );
}
=======
// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";

// export default function Customers() {
//   const [customers, setCustomers] = useState([]); // <-- axios will fill this
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [query, setQuery] = useState("");

//   useEffect(() => {
//   const fetchCustomers = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const response = await axios.get(
//         "http://localhost:8900/api/customers/all"
//       );

//       setCustomers(response.data);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch customers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchCustomers();
// }, []);

//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return customers;
//     return customers.filter((c) =>
//       `${c.customerId || ""} ${c.name || ""} ${c.email || ""} ${c.phone || ""} ${c.kycStatus || ""}`
//         .toLowerCase()
//         .includes(q)
//     );
//   }, [customers, query]);

//   return (
//     <div style={{ padding: 20 }}>
//       <h2 style={{ marginBottom: 6, color: "#2563eb" }}>Customers</h2>
      

//       <div style={{ display: "flex", gap: 10, margin: "14px 0" }}>
//         <input
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search by id / name / email / phone / KYC..."
//           style={inputStyle}
//         />
//       </div>

//       {loading && <Info text="Loading customers..." />}
//       {error && <ErrorBox text={error} />}

//       <div style={tableWrap}>
//         <table style={tableStyle}>
//           <thead style={{ background: "#fafafa" }}>
//             <tr>
//               <Th>Customer ID</Th>
//               <Th>Name</Th>
//               <Th>Email</Th>
//               <Th>Phone</Th>
//               <Th>KYC</Th>
//               <Th>Created On</Th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.map((c) => (
//               <tr key={c.customerid} style={{ borderTop: "1px solid #eee" }}>
//                 <Td style={{ fontWeight: 600 }}>{c.customerid}</Td>
//                 <Td>{c.fullname}</Td>
//                 <Td>{c.email}</Td>
//                 <Td>{c.phone}</Td>
//                 <Td>{c.kycstatus}</Td>
//                 <Td>{c.createdat}</Td>
//               </tr>
//             ))}

//             {!loading && filtered.length === 0 && (
//               <tr>
//                 <Td colSpan={6} style={{ textAlign: "center", padding: 20, color: "#777" }}>
//                   No customers found.
//                 </Td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" };
// const tableWrap = { border: "1px solid #e5e5e5", borderRadius: 10, overflow: "hidden" };
// const tableStyle = { width: "100%", borderCollapse: "collapse" };

// function Th({ children }) {
//   return <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 13, color: "#444" }}>{children}</th>;
// }
// function Td({ children, ...props }) {
//   return <td {...props} style={{ padding: "10px 12px", fontSize: 14, ...(props.style || {}) }}>{children}</td>;
// }
// function Info({ text }) {
//   return <div style={{ padding: 10, marginBottom: 10, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10 }}>{text}</div>;
// }
// function ErrorBox({ text }) {
//   return <div style={{ padding: 10, marginBottom: 10, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, color: "#991b1b" }}>{text}</div>;
// }
// ``

import { useEffect, useState } from "react";
import axios from "axios";
import CustomerCard from "../../components/CustomerCard";
import CustomerSummary from "../../components/CustomerSummary";
import CustomerDetailsPanel from "../../components/CustomerDetailsPanel";

export default function Customers() {
  const [listState, setListState] = useState({ status: "idle", data: null });
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchCustomers = async () => {
      setListState({ status: "loading", data: null });
      try {
        const res = await axios.get(
          "http://localhost:8900/api/customers/all"
        );

        if (!active) return;

        const normalized = Array.isArray(res.data)
          ? res.data.map((c) => ({
              id: c.customerid,
              customerId: c.customerid,
              name: c.fullname,
              email: c.email,
              phone: c.phone,
              address: c.address,
              createdAt: c.createdat,
              kycStatus: c.kycstatus,
            }))
          : [];

        setListState({ status: "success", data: normalized });
        setSelectedCustomer(normalized[0] ?? null);
      } catch {
        if (active) setListState({ status: "error", data: null });
      }
    };

    fetchCustomers();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="container-fluid p-4">
      <header className="mb-4">
        <h2 style={{ marginBottom: 6, color: "#2563eb" }}>Customers</h2>
        <p className="text-body-secondary mb-0">
          View and manage customer profiles and KYC status
        </p>
      </header>

      <section className="row g-4">
        <div className="col-xl-8">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h2 className="h5 fw-semibold mb-3">Customer List</h2>

              {listState.status === "loading" && (
                <div className="spinner-border spinner-border-sm" />
              )}

              {listState.status === "error" && (
                <div className="text-danger">
                  Unable to load customers
                </div>
              )}

              {Array.isArray(listState.data) && (
                <div className="row g-3">
                  {listState.data.map((customer) => (
                    <div
                      key={customer.id}
                      className="col-md-6 col-xl-4"
                      role="button"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <CustomerCard customer={customer} />
                    </div>
                  ))}
                </div>
              )}

              {listState.status === "success" &&
                listState.data?.length === 0 && (
                  <p className="text-body-secondary mb-0">
                    No customers found
                  </p>
                )}
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="d-flex flex-column gap-3">
            <CustomerSummary customer={selectedCustomer} />
            <CustomerDetailsPanel customer={selectedCustomer} />
          </div>
        </div>
      </section>
    </main>
  );
}
``
>>>>>>> bfb824e2258214349f8bf8c88600254417810ac8
