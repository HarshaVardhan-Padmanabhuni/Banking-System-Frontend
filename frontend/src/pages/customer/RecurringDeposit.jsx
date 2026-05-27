import { useState } from "react";
<<<<<<< HEAD

import "./features.css";

const plans = [

  { name: "Basic", duration: 6, rate: "5.5%" },

  { name: "Standard", duration: 12, rate: "6.5%" },

  { name: "Premium", duration: 36, rate: "7.2%" },

];

export default function RecurringDeposit() {

  const [selectedPlan, setSelectedPlan] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [account, setAccount] = useState("");

  const [monthlyAmount, setMonthlyAmount] = useState("");

  const [pin, setPin] = useState("");

  const [step, setStep] = useState(1);

  const [attempts, setAttempts] = useState(0);

  const [locked, setLocked] = useState(false);

  const [message, setMessage] = useState("");

  const CORRECT_PIN = "1234";

  // 🔥 MATURITY CALCULATION

  const getMaturityAmount = () => {

    if (!monthlyAmount || !selectedPlan) return "";

    const rate = parseFloat(selectedPlan.rate);

    const months = selectedPlan.duration;

    const maturity =

      Number(monthlyAmount) * months * (1 + rate / 100);

    return maturity.toFixed(2);

  };

  const handlePlanSelect = (plan) => {

    setSelectedPlan(plan);

    setShowModal(true);

    setStep(1);

  };

  const handleBack = () => {

    if (step > 1) {

      setStep(step - 1);

      setMessage("");

      setPin("");

    }

  };

  const handleClose = () => {

    setShowModal(false);

    setStep(1);

    setAccount("");

    setMonthlyAmount("");

    setPin("");

    setMessage("");

    setAttempts(0);

    setLocked(false);

  };

  const handleDetailsSubmit = (e) => {

    e.preventDefault();

    setStep(2);

  };

  const handlePinSubmit = (e) => {

    e.preventDefault();

    if (locked) return;

    if (pin === CORRECT_PIN) {

      setMessage(

        `RD created at ${selectedPlan.rate} for ${selectedPlan.duration} months`

      );

      setStep(3);

    } else {

      const newAttempts = attempts + 1;

      setAttempts(newAttempts);

      if (newAttempts >= 3) {

        setLocked(true);

        setMessage("Too many incorrect attempts. Try again in 30 seconds.");

        setTimeout(() => {

          setLocked(false);

          setAttempts(0);

          setPin("");

          setMessage("");

        }, 30000);

      } else {

        setMessage("Incorrect PIN");

      }

    }

  };

  return (
<div className="deposit-page">
<h2 className="page-title">Recurring Deposit</h2>

      {/* PLAN SELECTION */}
<div className="deposit-card form-grid">

        {plans.map((plan, index) => (
<div

            key={index}

            className="plan-card"

            onClick={() => handlePlanSelect(plan)}
>
<h3>{plan.name}</h3>
<p>{plan.duration} Months</p>
<p>{plan.rate} Interest</p>
</div>

        ))}
</div>

      {/* POPUP */}

      {showModal && (
<div className="modal-overlay">
<div className="modal-box">
<h3 className="popup-title">

              {selectedPlan.name} RD
</h3>

            {/* STEP 1 */}

            {step === 1 && (
<form onSubmit={handleDetailsSubmit} className="form-grid">
<div className="form-group">
<label>Account Number</label>
<input

                    type="text"

                    value={account}

                    onChange={(e) => setAccount(e.target.value)}

                    required

                  />
</div>
<div className="form-group">
<label>Monthly Amount</label>
<input

                    type="number"

                    value={monthlyAmount}

                    onChange={(e) => setMonthlyAmount(e.target.value)}

                    required

                  />
</div>

                {/* 🔥 MATURITY */}

                {monthlyAmount && (
<div className="maturity-box">
<p className="label">Maturity Amount</p>
<p className="value">₹ {getMaturityAmount()}</p>
</div>

                )}
<div className="form-actions">
<button type="submit">Proceed</button>
</div>
<button

                  type="button"

                  className="back-btn"

                  onClick={handleClose}
>

                  Cancel
</button>
</form>

            )}

            {/* STEP 2 */}

            {step === 2 && (
<div className={`pin-section ${locked ? "disabled" : ""}`}>
<div className="summary-block">
<div>
<p className="label">Plan</p>
<p className="value">{selectedPlan.name}</p>
</div>
<div>
<p className="label">Monthly</p>
<p className="value">₹ {monthlyAmount}</p>
</div>
<div>
<p className="label">Maturity</p>
<p className="value">₹ {getMaturityAmount()}</p>
</div>
</div>
<div className="pin-form-container">
<form onSubmit={handlePinSubmit} className="pin-form">
<input

                      type="password"

                      placeholder="Enter PIN"

                      value={pin}

                      onChange={(e) => setPin(e.target.value)}

                      disabled={locked}

                      required

                    />
<button type="submit" disabled={locked}>

                      Create RD
</button>
</form>
<button className="back-btn" onClick={handleBack}>

                    ← Back
</button>
</div>
</div>

            )}

            {/* STEP 3 */}

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
 
=======
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import "./features.css";

const plans = [
  { name: "Basic", duration: 6, rate: "5.5%" },
  { name: "Standard", duration: 12, rate: "6.5%" },
  { name: "Premium", duration: 36, rate: "7.2%" },
];

export default function RecurringDeposit() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const accountNumber = localStorage.getItem("accountnumber");
  const accountId = localStorage.getItem("accountid");
  const userid = Number(localStorage.getItem("userid"));

  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [accountStatus, setAccountStatus] = useState("");

  const getMaturityAmount = () => {
    if (!monthlyAmount || !selectedPlan) return "";
    const rate = parseFloat(selectedPlan.rate);
    const months = selectedPlan.duration;
    const maturity = Number(monthlyAmount) * months * (1 + rate / 100);
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
    setMonthlyAmount("");
    setPassword("");
    setMessage("");
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const monthly = parseFloat(monthlyAmount);

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
    if (!monthly || isNaN(monthly) || monthly <= 0) {
      setMessage("Invalid monthly amount");
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
      const tenureMonths = selectedPlan.duration;

      const today = new Date();
      today.setMonth(today.getMonth() + tenureMonths);
      const maturityDate = today.toISOString().split("T")[0];

      await API.post(`/deposits/recurring/${accountId}`, {
        userId: userid,
        password: password.trim(),
        rd: {
          monthlyamount: monthly,
          tenuremonths: tenureMonths,
          interestrate: rate,
          maturitydate: maturityDate,
        },
      });

      setMessage(`RD created for ${tenureMonths} months`);
      setStep(3);

      setMonthlyAmount("");
      setPassword("");
    } catch (err) {
      console.error(err);
      if (err.response) {
        setMessage(
          err.response.data?.message ||
            err.response.data?.error ||
            "RD creation failed"
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

      <h2 className="page-title">Recurring Deposit</h2>

      <div className="deposit-card form-grid">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="plan-card"
            onClick={() => handlePlanSelect(plan)}
          >
            <h3>{plan.name}</h3>
            <p>{plan.duration} Months</p>
            <p>{plan.rate} Interest</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="popup-title">{selectedPlan.name} RD</h3>

            {step === 1 && (
              <form onSubmit={handleDetailsSubmit} className="form-grid">
                <div className="form-group">
                  <label>Monthly Amount</label>
                  <input
                    type="number"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(e.target.value)}
                    required
                  />
                </div>

                {monthlyAmount && (
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
                    <p className="label">Monthly</p>
                    <p className="value">₹ {monthlyAmount}</p>
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
                        : "Create RD"}
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
>>>>>>> bfb824e2258214349f8bf8c88600254417810ac8
