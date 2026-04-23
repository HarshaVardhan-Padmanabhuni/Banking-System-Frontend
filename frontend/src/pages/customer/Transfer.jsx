import { useState } from "react";

import "./customer.css";
export default function Transfer() {
 const [fromAcc, setFromAcc] = useState("");
 const [toAcc, setToAcc] = useState("");
 const [amount, setAmount] = useState("");
 const [msg, setMsg] = useState("");
 const handleSubmit = (e) => {
   e.preventDefault();
   if (!fromAcc || !toAcc || !amount) {
     setMsg("Please fill all fields");
     return;
   }
   setMsg("✅ Transfer successful!");
 };
 return (
<>

<div className="form-container">
<h3 className="form-title">🔁 Transfer Money</h3>
<form onSubmit={handleSubmit}>
<input
           type="text"
           placeholder="From Account"
           className="form-control"
           value={fromAcc}
           onChange={(e) => setFromAcc(e.target.value)}
         />
<input
           type="text"
           placeholder="To Account"
           className="form-control"
           value={toAcc}
           onChange={(e) => setToAcc(e.target.value)}
         />
<input
           type="number"
           placeholder="Amount"
           className="form-control"
           value={amount}
           onChange={(e) => setAmount(e.target.value)}
         />
<button className="btn-submit">Transfer</button>
</form>
       {msg && <p className="success-msg">{msg}</p>}
</div>
</>
 );
}