import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import "./features.css";

const plans = [
  { name: "Basic", duration: "6 Months", rate: "5.5%" },
  { name: "Standard", duration: "1 Year", rate: "6.5%" },
  { name: "Premium", duration: "3 Years", rate: "7.2%" },
];

export default function FixedDeposit() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const accountNumber = localStorage.getItem("accountnumber");
  const accountId = localStorage.getItem("accountid");
  const userid = Number(localStorage.getItem("userid"));

  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [accountStatus, setAccountStatus] = useState("");

  const getMaturityAmount = () => {
    if (!amount || !selectedPlan) return "";
    const rate = parseFloat(selectedPlan.rate);
    const maturity = Number(amount) * (1 + rate / 100);
    return maturity.toFixed(2);
  };

  const handlePlanSelect = async (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
    setStep(1);
    setMessage("");
    setPassword("");

    try {
      const res = await API.get(`/accounts/${accountId}`);
      setAccountStatus(res.data.status);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch account status");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setMessage("");
      setPassword("");
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setStep(1);
    setAmount("");
    setPassword("");
    setMessage("");
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const amt = parseFloat(amount);

    if (!accountNumber) {
      setMessage("Account number missing");
      return;
    }
    if (!accountId) {
      setMessage("Account ID missing");
      return;
    }
    if (!userid) {
      setMessage("User ID missing. Please login again.");
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

    if (accountStatus !== "ACTIVE") {
      setMessage("Account is INACTIVE. Transactions not allowed.");
      return;
    }

    try {
      setLoading(true);

      const rate = parseFloat(selectedPlan.rate);

      let tenureMonths = 0;
      if (selectedPlan.duration.includes("6")) tenureMonths = 6;
      else if (selectedPlan.duration.includes("1")) tenureMonths = 12;
      else if (selectedPlan.duration.includes("3")) tenureMonths = 36;

      const maturityAmount = amt * (1 + rate / 100);
      //maturity date
      const today = new Date();
      if (tenureMonths === 6) today.setMonth(today.getMonth() + 6);
      else if (tenureMonths === 12) today.setFullYear(today.getFullYear() + 1);
      else if (tenureMonths === 36) today.setFullYear(today.getFullYear() + 3);

      const maturityDate = today.toISOString().split("T")[0];
      const todayDate = new Date().toISOString().split("T")[0];

      await API.post(`/deposits/fixed/${accountId}`, {
        userId: userid,
        password: password.trim(),
        fd: {
          principalamount: amt,
          interestrate: rate,
          tenuremonths: tenureMonths,
          maturityamount: maturityAmount,
          maturitydate: maturityDate,
          startdate: todayDate
        },
      });

      setMessage(`FD created at ${rate}% for ${selectedPlan.duration}`);
      setStep(3);

      setAmount("");
      setPassword("");
    } catch (err) {
      console.error(err);
      if (err.response) {
        setMessage(
          err.response.data?.message ||
            err.response.data?.error ||
            "FD creation failed"
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

      <h2 className="page-title">Fixed Deposit</h2>

      <div className="deposit-card form-grid">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="plan-card"
            onClick={() => handlePlanSelect(plan)}
          >
            <h3>{plan.name}</h3>
            <p>{plan.duration}</p>
            <p>{plan.rate} Interest</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="popup-title">{selectedPlan.name} FD</h3>

            {step === 1 && (
              <form onSubmit={handleDetailsSubmit} className="form-grid">
                <div className="form-group">
                  <label>Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                {amount && (
                  <div className="maturity-box">
                    <p className="label">Maturity Amount</p>
                    <p className="value">₹ {getMaturityAmount()}</p>
                  </div>
                )}

                <div className="form-actions">
                  <button type="submit">Proceed</button>
                </div>

                <button type="button" className="back-btn" onClick={handleClose}>
                  Cancel
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="pin-section">
                <div className="summary-block">
                  <div>
                    <p className="label">Plan</p>
                    <p className="value">{selectedPlan.name}</p>
                  </div>

                  <div>
                    <p className="label">Amount</p>
                    <p className="value">₹ {amount}</p>
                  </div>

                  <div>
                    <p className="label">Maturity</p>
                    <p className="value">₹ {getMaturityAmount()}</p>
                  </div>
                </div>

                <div className="pin-form-container">
                  <form onSubmit={handlePasswordSubmit} className="pin-form">
                    <input
                      type="password"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />

                    <button
                      type="submit"
                      disabled={loading || accountStatus !== "ACTIVE"}
                    >
                      {accountStatus !== "ACTIVE"
                        ? "Account Inactive"
                        : loading
                        ? "Processing..."
                        : "Create FD"}
                    </button>
                  </form>

                  <button className="back-btn" onClick={handleBack}>
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="success-box">
                {message}
                <button className="close-btn" onClick={handleClose}>
                  Close
                </button>
              </div>
            )}

            {message && step !== 3 && <p className="error">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}