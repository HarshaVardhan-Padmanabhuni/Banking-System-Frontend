import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import "./features.css";

export default function Transfer() {
  const navigate = useNavigate();
  const fromAccountNumber = localStorage.getItem("accountnumber");
  const userid = Number(localStorage.getItem("userid"));

  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const amt = parseFloat(amount);

    if (!fromAccountNumber) {
      setMessage("From account number missing");
      return;
    }

    if (!userid) {
      setMessage("User ID missing. Please login again.");
      return;
    }

    if (!toAccount || toAccount.trim() === "") {
      setMessage("Invalid To Account");
      return;
    }

    if (fromAccountNumber.toLowerCase() === toAccount.toLowerCase()) {
      setMessage("Cannot transfer to same account");
      return;
    }

    if (!amt || isNaN(amt) || amt <= 0) {
      setMessage("Invalid amount");
      return;
    }

    if (!password || password.trim() === "") {
      setMessage("Password is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        fromAccountNumber,
        toAccountNumber: toAccount.trim(),
        amount: amt,
        userId:userid,
        password: password.trim(),
      };

      const res = await API.post("/api/transactions/transfer", payload);

      setMessage(res.data?.message || `₹ ${amt} transferred successfully!`);
      setStep(3);

      setToAccount("");
      setAmount("");
      setPassword("");
    } catch (err) {
      console.error(err);
      if (err.response) {
        setMessage(
          err.response.data?.message ||
            err.response.data?.error ||
            "Transfer failed"
        );
      } else {
        setMessage("Server not reachable");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deposit-page">
      {/* Back Button */}
      <button onClick={() => navigate('/customer-dashboard')} style={{ marginBottom: '20px', padding: '8px 16px', backgroundColor: '#16a085', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
        ← Back to Dashboard
      </button>

      <h2 className="page-title">Transfer Money</h2>

      <div className="deposit-card">
        {step === 1 && (
          <form onSubmit={handleDetailsSubmit} className="form-grid">
            <div className="form-group">
              <label>To Account</label>
              <input
                type="text"
                value={toAccount}
                onChange={(e) => setToAccount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit">Proceed</button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="pin-section">
            <div className="summary-block">
              <div>
                <p className="label">From</p>
                <p className="value">{fromAccountNumber}</p>
              </div>
              <div>
                <p className="label">To</p>
                <p className="value">{toAccount}</p>
              </div>
              <div>
                <p className="label">Amount</p>
                <p className="value">₹ {amount}</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="pin-form">
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Confirm Transfer"}
              </button>
            </form>

            <button className="back-btn" onClick={() => setStep(1)}>
              ← Back
            </button>
          </div>
        )}

        {step === 3 && <div className="success-box">{message}</div>}

        {message && step !== 3 && <p className="error">{message}</p>}
      </div>
    </div>
  );
}
