<<<<<<< HEAD
import { useState } from "react";

import "./features.css"; // 🔥 reuse same CSS

export default function Withdraw() {

  const [account, setAccount] = useState("");

  const [amount, setAmount] = useState("");

  const [pin, setPin] = useState("");

  const [step, setStep] = useState(1);

  const [attempts, setAttempts] = useState(0);

  const [locked, setLocked] = useState(false);

  const [message, setMessage] = useState("");

  const CORRECT_PIN = "1234";

  const handleDetailsSubmit = (e) => {

    e.preventDefault();

    setStep(2);

  };

  const handlePinSubmit = (e) => {

    e.preventDefault();

    if (locked) return;

    if (pin === CORRECT_PIN) {

      // 🔥 withdraw logic (UI simulation)

      setMessage(`₹ ${amount} withdrawn successfully!`);

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
<h2 className="page-title">Withdraw Money</h2>
<div className="deposit-card">

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
<div className="form-actions">
<button type="submit">Proceed</button>
</div>
</form>

        )}

        {/* STEP 2 */}

        {step === 2 && (
<div className={`pin-section ${locked ? "disabled" : ""}`}>
<div className="summary-block">
<div>
<p className="label">Account</p>
<p className="value">{account}</p>
</div>
<div>
<p className="label">Amount</p>
<p className="value">₹ {amount}</p>
</div>
</div>
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

                Confirm Transaction
</button>
</form>
</div>

        )}

        {/* STEP 3 */}

        {step === 3 && (
<div className="success-box">

            {message}
</div>

        )}

        {message && step !== 3 && <p className="error">{message}</p>}
</div>
</div>

  );

=======
 
import { useState } from "react";
import API from "../../api/api";   // ✅ important
import "./features.css";
 
export default function Withdraw() {
 
  const accountNumber =
  localStorage.getItem("accountnumber");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
 
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
 
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };
 
  const handlePinSubmit = async (e) => {
    e.preventDefault();
 
const amt = parseFloat(amount);

    // ✅ validation
    if (!accountNumber) {
  setMessage("Account number missing");
  return;
}
 
    if (!amt || isNaN(amt)) {
      setMessage("Invalid amount");
      return;
    }
 
    if (pin.length !== 4) {
      setMessage("PIN must be 4 digits");
      return;
    }
 
    try {
      setLoading(true);
      const res = await API.post("/api/transactions/withdraw", {
        accountnumber: accountNumber,
        amount: amt
      });
 
      setMessage(res.data?.message || `₹ ${amt} withdrawn successfully!`);
      setStep(3);
 
      // reset form
     
      setAmount("");
      setPin("");
 
    } catch (err) {
      console.error(err);
 
      if (err.response) {
        setMessage(err.response.data?.message || "Withdraw failed");
      } else {
        setMessage("Server not reachable");
      }
 
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="deposit-page">
      <h2 className="page-title">Withdraw Money</h2>
 
      <div className="deposit-card">
 
        {/* STEP 1 */}
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
 
            <div className="form-actions">
              <button type="submit">Proceed</button>
            </div>
 
          </form>
        )}
 
        {/* STEP 2 */}
        {step === 2 && (
          <div className="pin-section">
 
            <div className="summary-block">
              <div>
                <p className="label">Account</p>
                <p className="value">{accountNumber}</p>
              </div>
              <div>
                <p className="label">Amount</p>
                <p className="value">₹ {amount}</p>
              </div>
            </div>
 
            <form onSubmit={handlePinSubmit} className="pin-form">
              <input
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
              />
 
              <button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Confirm Transaction"}
              </button>
            </form>
 
          </div>
        )}
 
        {/* STEP 3 */}
        {step === 3 && (
          <div className="success-box">
            {message}
          </div>
        )}
 
        {message && step !== 3 && <p className="error">{message}</p>}
 
      </div>
    </div>
  );
>>>>>>> bfb824e2258214349f8bf8c88600254417810ac8
}
 