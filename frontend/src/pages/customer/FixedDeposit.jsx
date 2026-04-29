import { useState } from "react";

import "./features.css";

const plans = [

  { name: "Basic", duration: "6 Months", rate: "5.5%" },

  { name: "Standard", duration: "1 Year", rate: "6.5%" },

  { name: "Premium", duration: "3 Years", rate: "7.2%" },

];

export default function FixedDeposit() {

  const [selectedPlan, setSelectedPlan] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [account, setAccount] = useState("");

  const [amount, setAmount] = useState("");

  const [pin, setPin] = useState("");

  const [step, setStep] = useState(1);

  const [attempts, setAttempts] = useState(0);

  const [locked, setLocked] = useState(false);

  const [message, setMessage] = useState("");

  const CORRECT_PIN = "1234";

  // 🔥 MATURITY CALCULATION

  const getMaturityAmount = () => {

    if (!amount || !selectedPlan) return "";

    const rate = parseFloat(selectedPlan.rate);

    const maturity = Number(amount) * (1 + rate / 100);

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

    setAmount("");

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

        `FD created at ${selectedPlan.rate} for ${selectedPlan.duration}`

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
<h2 className="page-title">Fixed Deposit</h2>

      {/* PLAN SELECTION */}
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

      {/* POPUP */}

      {showModal && (
<div className="modal-overlay">
<div className="modal-box">
<h3 className="popup-title">

              {selectedPlan.name} FD
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
<label>Amount</label>
<input

                    type="number"

                    value={amount}

                    onChange={(e) => setAmount(e.target.value)}

                    required

                  />
</div>

                {/* 🔥 MATURITY DISPLAY */}

                {amount && (
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
<p className="label">Amount</p>
<p className="value">₹ {amount}</p>
</div>

                  {/* 🔥 MATURITY IN SUMMARY */}
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

                      Create FD
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
 