import React, { useEffect, useMemo, useState } from "react";

export default function ManageAccounts() {
  const [accounts, setAccounts] = useState([]); // axios fills
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    // TODO: axios GET accounts
    // setLoading(true);
    // axios
    //   .get("/api/accounts")
    //   .then((res) => setAccounts(res.data))
    //   .catch((err) => setError(err.message))
    //   .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return accounts;

    return accounts.filter((a) =>
      `${a.accountNo || ""} ${a.customerId || ""} ${a.customerName || ""} ${a.type || ""} ${a.status || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [accounts, query]);

  const updateStatus = (accountNo, status) => {
    // optional optimistic update
    setAccounts((prev) =>
      prev.map((a) => (a.accountNo === accountNo ? { ...a, status } : a))
    );

    // TODO: axios PATCH/PUT account status
    // axios.patch(`/api/accounts/${accountNo}`, { status });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 6, color: "#2563eb" }}>Manage Accounts</h2>
      

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by account no / customer / status..."
        style={inputStyle}
      />

      {loading && <Info text="Loading accounts..." />}
      {error && <ErrorBox text={error} />}

      <div style={{ marginTop: 14, ...tableWrap }}>
        <table style={tableStyle}>
          <thead style={{ background: "#fafafa" }}>
            <tr>
              <Th>Account No</Th>
              <Th>Customer</Th>
              <Th>Type</Th>
              <Th>Balance</Th>
              <Th>Opened On</Th>
              <Th>Status</Th>
              <Th>Update</Th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((a) => (
              <tr key={a.accountNo} style={{ borderTop: "1px solid #eee" }}>
                <Td style={{ fontWeight: 600 }}>{a.accountNo}</Td>

                <Td>
                  <div style={{ fontWeight: 600 }}>{a.customerName}</div>
                  <div style={{ fontSize: 12, color: "#777" }}>{a.customerId}</div>
                </Td>

                <Td>{a.type}</Td>
                <Td>{a.balance}</Td>
                <Td>{a.openedOn}</Td>
                <Td>{a.status}</Td>

                <Td>
                  <select
                    value={a.status}
                    onChange={(e) => updateStatus(a.accountNo, e.target.value)}
                    style={selectStyle}
                  >
                    <option value="Active">Active</option>
                    <option value="Frozen">Frozen</option>
                    <option value="Closed">Closed</option>
                  </select>
                </Td>
              </tr>
            ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <Td colSpan={7} style={{ textAlign: "center", padding: 20, color: "#777" }}>
                  No accounts found.
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  marginTop: 14,
};

const selectStyle = {
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid #ddd",
};

const tableWrap = {
  border: "1px solid #e5e5e5",
  borderRadius: 10,
  overflow: "hidden",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

function Th({ children }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "10px 12px",
        fontSize: 13,
        color: "#444",
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, ...props }) {
  return (
    <td
      {...props}
      style={{
        padding: "10px 12px",
        fontSize: 14,
        ...(props.style || {}),
      }}
    >
      {children}
    </td>
  );
}

function Info({ text }) {
  return (
    <div
      style={{
        padding: 10,
        marginTop: 10,
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        borderRadius: 10,
      }}
    >
      {text}
    </div>
  );
}

function ErrorBox({ text }) {
  return (
    <div
      style={{
        padding: 10,
        marginTop: 10,
        background: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: 10,
        color: "#991b1b",
      }}
    >
      {text}
    </div>
  );
}
``