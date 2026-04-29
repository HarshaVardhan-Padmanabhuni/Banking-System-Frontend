import React, { useEffect, useState } from "react";

export default function EmployeeDashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeAccounts: 0,
    pendingRequests: 0,
    openTickets: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]); // axios fills
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // TODO: axios GET dashboard stats
    // axios.get("/api/dashboard/stats").then(res => setStats(res.data))

    // TODO: axios GET recent activity
    // axios.get("/api/dashboard/recent-activity").then(res => setRecentActivity(res.data))

    // If you want combined loading:
    // setLoading(true)
    // Promise.all([axios.get(...), axios.get(...)])
    //   .then(([statsRes, activityRes]) => { setStats(statsRes.data); setRecentActivity(activityRes.data); })
    //   .catch(err => setError(err.message))
    //   .finally(() => setLoading(false))
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 6, color: "#2563eb" }}>Employee Dashboard</h2>
      
      {loading && <Info text="Loading dashboard..." />}
      {error && <ErrorBox text={error} />}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 16 }}>
        <Card title="Total Customers" value={stats.totalCustomers} />
        <Card title="Active Accounts" value={stats.activeAccounts} />
        <Card title="Pending Requests" value={stats.pendingRequests} highlight />
        <Card title="Open Tickets" value={stats.openTickets} highlight />
      </div>

      <div style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 10 }}>Recent Activity</h3>
        <div style={{ border: "1px solid #e5e5e5", borderRadius: 10, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#fafafa" }}>
              <tr>
                <Th>Activity ID</Th>
                <Th>Type</Th>
                <Th>Reference</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((a) => (
                <tr key={a.activityId} style={{ borderTop: "1px solid #eee" }}>
                  <Td style={{ fontWeight: 600 }}>{a.activityId}</Td>
                  <Td>{a.type}</Td>
                  <Td>{a.reference}</Td>
                  <Td>{a.date}</Td>
                </tr>
              ))}

              {!loading && recentActivity.length === 0 && (
                <tr>
                  <Td colSpan={4} style={{ textAlign: "center", padding: 20, color: "#777" }}>
                    No activity yet.
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, highlight }) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 12,
        border: "1px solid #e5e5e5",
        background: highlight ? "#fff7ed" : "#fff",
      }}
    >
      <div style={{ color: "#666", fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 26, fontWeight: 700, marginTop: 6 }}>{value}</div>
    </div>
  );
}

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