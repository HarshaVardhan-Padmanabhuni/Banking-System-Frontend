import React, { useEffect, useMemo, useState } from "react";

export default function AccountRequests() {
  const [requests, setRequests] = useState([]); // axios fills
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    // TODO: axios GET account requests
    // setLoading(true)
    // axios.get("/api/account-requests")
    //   .then(res => setRequests(res.data))
    //   .catch(err => setError(err.message))
    //   .finally(() => setLoading(false))
  }, []);

  const filtered = useMemo(() => {
    if (filter === "All") return requests;
    return requests.filter((r) => r.status === filter);
  }, [requests, filter]);

  const updateStatus = (requestId, status) => {
    // optional optimistic update:
    setRequests((prev) =>
      prev.map((r) => (r.requestId === requestId ? { ...r, status } : r))
    );

    // TODO: axios PATCH/PUT request status
    // axios.patch(`/api/account-requests/${requestId}`, { status })
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 6, color: "#2563eb"}}>Account Requests</h2>

      <div style={{ display: "flex", gap: 10, margin: "14px 0" }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={selectStyle}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {loading && <Info text="Loading requests..." />}
      {error && <ErrorBox text={error} />}

      <div style={tableWrap}>
        <table style={tableStyle}>
          <thead style={{ background: "#fafafa" }}>
            <tr>
              <Th>Request ID</Th>
              <Th>Customer</Th>
              <Th>Account Type</Th>
              <Th>Requested On</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.requestId} style={{ borderTop: "1px solid #eee" }}>
                <Td style={{ fontWeight: 600 }}>{r.requestId}</Td>
                <Td>
                  <div style={{ fontWeight: 600 }}>{r.customerName}</div>
                  <div style={{ fontSize: 12, color: "#777" }}>{r.customerId}</div>
                </Td>
                <Td>{r.accountType}</Td>
                <Td>{r.requestedOn}</Td>
                <Td>{r.status}</Td>
                <Td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      style={btnPrimary}
                      onClick={() => updateStatus(r.requestId, "Approved")}
                      disabled={r.status === "Approved"}
                    >
                      Approve
                    </button>
                    <button
                      style={btnDanger}
                      onClick={() => updateStatus(r.requestId, "Rejected")}
                      disabled={r.status === "Rejected"}
                    >
                      Reject
                    </button>
                  </div>
                </Td>
              </tr>
            ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <Td colSpan={6} style={{ textAlign: "center", padding: 20, color: "#777" }}>
                  No requests found.
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const selectStyle = { padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd" };
const tableWrap = { border: "1px solid #e5e5e5", borderRadius: 10, overflow: "hidden" };
const tableStyle = { width: "100%", borderCollapse: "collapse" };

const btnPrimary = { padding: "6px 10px", borderRadius: 8, border: "1px solid #0ea5e9", background: "#0ea5e9", color: "#fff", cursor: "pointer" };
const btnDanger = { padding: "6px 10px", borderRadius: 8, border: "1px solid #ef4444", background: "#ef4444", color: "#fff", cursor: "pointer" };

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