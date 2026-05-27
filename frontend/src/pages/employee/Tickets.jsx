<<<<<<< HEAD
export default function Tickets() { 
    return (
        <>  
            <div className="container mt-5 pt-5 w-50">
                <h2>Support Tickets</h2>
                <p>Feature coming soon...</p>           
            </div>
        </>
    );
}
=======
import React, { useEffect, useMemo, useState } from "react";

export default function Tickets() {
  const [tickets, setTickets] = useState([]); // axios fills
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    // TODO: axios GET tickets
    // setLoading(true)
    // axios.get("/api/tickets")
    //   .then(res => setTickets(res.data))
    //   .catch(err => setError(err.message))
    //   .finally(() => setLoading(false))
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "All") return tickets;
    return tickets.filter((t) => t.status === statusFilter);
  }, [tickets, statusFilter]);

  const handleStatusChange = (ticketId, newStatus) => {
    // Template only: UI update optional
    setTickets((prev) =>
      prev.map((t) => (t.ticketId === ticketId ? { ...t, status: newStatus } : t))
    );

    // TODO: axios PATCH/PUT ticket status
    // axios.patch(`/api/tickets/${ticketId}`, { status: newStatus })
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 6, color: "#2563eb" }}>Support Tickets</h2>

      <div style={{ display: "flex", gap: 10, margin: "14px 0" }}>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={selectStyle}>
          <option value="All">All</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {loading && <Info text="Loading tickets..." />}
      {error && <ErrorBox text={error} />}

      <div style={tableWrap}>
        <table style={tableStyle}>
          <thead style={{ background: "#fafafa" }}>
            <tr>
              <Th>Ticket ID</Th>
              <Th>Subject</Th>
              <Th>Priority</Th>
              <Th>Raised By</Th>
              <Th>Created At</Th>
              <Th>Status</Th>
              <Th>Update</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.ticketId} style={{ borderTop: "1px solid #eee" }}>
                <Td style={{ fontWeight: 600 }}>{t.ticketId}</Td>
                <Td>{t.subject}</Td>
                <Td>{t.priority}</Td>
                <Td>{t.raisedBy}</Td>
                <Td>{t.createdAt}</Td>
                <Td>{t.status}</Td>
                <Td>
                  <select
                    value={t.status}
                    onChange={(e) => handleStatusChange(t.ticketId, e.target.value)}
                    style={selectStyle}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </Td>
              </tr>
            ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <Td colSpan={7} style={{ textAlign: "center", padding: 20, color: "#777" }}>
                  No tickets found.
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
>>>>>>> bfb824e2258214349f8bf8c88600254417810ac8
