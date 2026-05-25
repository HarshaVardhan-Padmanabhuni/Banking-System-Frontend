 
import { useState } from "react";
import  API  from "../../api/api";// 👈 important
import "./features.css";
 
export default function Deposits() {
 
 
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
 
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const accountNumber = localStorage.getItem("accountnumber");
 
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };
 
  const handlePinSubmit = async (e) => {
    e.preventDefault();
 
    if (!amount) {
      setMessage("Enter account and amount");
      return;
    }

    if (!accountNumber) {
      setMessage("Account number not found. Please login again.");
      return;
    }
 
    try {
      setLoading(true);

      const payload = {
        accountNumber: accountNumber,
        amount: parseFloat(amount),
      };

      console.log("📤 Sending deposit request:", payload);
      console.log("🔑 Token:", localStorage.getItem("token") ? "Present" : "Missing");
 
      const res = await API.post("/api/transactions/deposit", payload);

      console.log("Response:", res.data);
      setMessage(res.data?.message || `₹ ${amount} deposited successfully!`);
      setStep(3);
      setAmount("");
     

    } catch (err) {
      console.error("Deposit Error:", err);
      console.error("Error Details:", {
        status: err.response?.status,
        message: err.response?.data?.message,
        data: err.response?.data,
        errorMessage: err.message
      });
 
      if (err.response) {
        setMessage(err.response.data?.message || "Transaction failed");
      } else {
        setMessage("Server not reachable. Is the backend running on port 9192?");
      }
 
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="deposit-page">
      <h2 className="page-title">Deposit Money</h2>
 
      <div className="deposit-card">
 
        {/* SECTION 1 */}
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
 
        {/* SECTION 2 */}
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
 
        {/* SECTION 3 */}
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