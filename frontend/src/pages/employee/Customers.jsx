import React, { useEffect, useMemo, useState } from "react";

export default function Customers() {
  const [customers, setCustomers] = useState([]); // <-- axios will fill this
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    // TODO: axios GET customers
    // setLoading(true)
    // axios.get("/api/customers")
    //   .then(res => setCustomers(res.data))
    //   .catch(err => setError(err.message))
    //   .finally(() => setLoading(false))
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      `${c.customerId || ""} ${c.name || ""} ${c.email || ""} ${c.phone || ""} ${c.kycStatus || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [customers, query]);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 6, color: "#2563eb" }}>Customers</h2>
      

      <div style={{ display: "flex", gap: 10, margin: "14px 0" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by id / name / email / phone / KYC..."
          style={inputStyle}
        />
      </div>

      {loading && <Info text="Loading customers..." />}
      {error && <ErrorBox text={error} />}

      <div style={tableWrap}>
        <table style={tableStyle}>
          <thead style={{ background: "#fafafa" }}>
            <tr>
              <Th>Customer ID</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>KYC</Th>
              <Th>Created On</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.customerId} style={{ borderTop: "1px solid #eee" }}>
                <Td style={{ fontWeight: 600 }}>{c.customerId}</Td>
                <Td>{c.name}</Td>
                <Td>{c.email}</Td>
                <Td>{c.phone}</Td>
                <Td>{c.kycStatus}</Td>
                <Td>{c.createdAt}</Td>
              </tr>
            ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <Td colSpan={6} style={{ textAlign: "center", padding: 20, color: "#777" }}>
                  No customers found.
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #ddd" };
const tableWrap = { border: "1px solid #e5e5e5", borderRadius: 10, overflow: "hidden" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };

function Th({ children }) {
  return <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 13, color: "#444" }}>{children}</th>;
}
function Td({ children, ...props }) {
  return <td {...props} style={{ padding: "10px 12px", fontSize: 14, ...(props.style || {}) }}>{children}</td>;
}
function Info({ text }) {
  return <div style={{ padding: 10, marginBottom: 10, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10 }}>{text}</div>;
}
function ErrorBox({ text }) {
  return <div style={{ padding: 10, marginBottom: 10, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, color: "#991b1b" }}>{text}</div>;
}
``