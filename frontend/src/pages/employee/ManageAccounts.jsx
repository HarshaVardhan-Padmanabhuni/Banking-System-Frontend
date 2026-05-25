import React, { useEffect, useMemo, useState } from "react";

export default function ManageAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8901/accounts");
      if (!res.ok) throw new Error();

      const data = await res.json();

      const mappedAccounts = data.map((a) => ({
      accountId: a.accountid,
      accountNo: a.accountnumber,
      type: a.accounttype,
      balance: a.balance,
      status: a.status,
      createdat: a.createdat,
      customerId: a.customer?.customerid,
      customerName: a.customer?.fullname,
    }));

      setAccounts(mappedAccounts);
    } catch {
      setError("Unable to load accounts");
    } finally {
      setLoading(false);
    }
  };

  const filteredAccounts = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return accounts;

    return accounts.filter((a) =>
      `${a.accountNumber} ${a.customerName} ${a.username} ${a.accountType} ${a.status}`
        .toLowerCase()
        .includes(q)
    );
  }, [accounts, query]);

  const updateStatus = async (accountId, status) => {
    setAccounts((prev) =>
      prev.map((a) =>
        a.accountId === accountId ? { ...a, status } : a
      )
    );

    await fetch(`http://localhost:8901/accounts/${accountId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  return (
    <div className="container-fluid">
      <h4 className="mb-3 text-primary">Manage Accounts</h4>

      <input
        className="form-control mb-3"
        placeholder="Search by account / customer / username / status"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <div className="alert alert-info">Loading accounts…</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Account No</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Balance</th>
                <th>Opened On</th>
                <th>KYC</th>
                <th>Status</th>
                <th>Update</th>
              </tr>
            </thead>

            <tbody>
              {filteredAccounts.map((a) => (
                <tr key={a.accountId}>
                  <td className="fw-semibold">{a.accountNo}</td>

                  <td>
                    <div className="fw-semibold">{a.customerName}</div>
                    <div className="text-muted small">{a.customerId}</div>
                  </td>

                  <td>{a.type}</td>

                  <td>₹ {a.balance}</td>

                  <td>{a.createdat}</td>

                  <td>
                    <span className={`badge ${
                      a.status === "ACTIVE" ? "bg-success" : "bg-secondary"
                    }`}>
                      {a.status}
                    </span>
                  </td>

                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={a.status}
                      onChange={(e) => updateStatus(a.accountId, e.target.value)}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                      <option value="FROZEN">FROZEN</option>
                    </select>
                  </td>
                </tr>
              ))}

              {!loading && filteredAccounts.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    No accounts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}