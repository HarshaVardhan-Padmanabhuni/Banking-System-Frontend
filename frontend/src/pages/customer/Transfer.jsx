import { useState } from "react";

import "./features.css"; // reuse same UI

export default function Transfer() {

  const [fromAccount, setFromAccount] = useState("");

  const [toAccount, setToAccount] = useState("");

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

      setMessage(`₹ ${amount} transferred successfully!`);

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
<h2 className="page-title">Transfer Money</h2>
<div className="deposit-card">

        {/* STEP 1 */}

        {step === 1 && (
<form onSubmit={handleDetailsSubmit} className="form-grid">
<div className="form-group">
<label>From Account</label>
<input

                type="text"

                value={fromAccount}

                onChange={(e) => setFromAccount(e.target.value)}

                required

              />
</div>
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

        {/* STEP 2 */}

        {step === 2 && (
<div className={`pin-section ${locked ? "disabled" : ""}`}>
<div className="summary-block">
<div>
<p className="label">From</p>
<p className="value">{fromAccount}</p>
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

                Confirm Transfer
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

}
 