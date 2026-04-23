import { useState } from "react";

import "./customer.css";
export default function Withdraw() {
 const [amount, setAmount] = useState("");
 const [account, setAccount] = useState("");
 const [msg, setMsg] = useState("");
 const handleSubmit = (e) => {
   e.preventDefault();
   if (!amount || !account) {
     setMsg("Please fill all fields");
     return;
   }
   setMsg("✅ Amount withdrawn successfully!");
 };
 return (
<>

<div className="form-container">
<h3 className="form-title">💸 Withdraw Money</h3>
<form onSubmit={handleSubmit}>
<input
           type="text"
           placeholder="Account Number"
           className="form-control"
           value={account}
           onChange={(e) => setAccount(e.target.value)}
         />
<input
           type="number"
           placeholder="Enter Amount"
           className="form-control"
           value={amount}
           onChange={(e) => setAmount(e.target.value)}
         />
<button className="btn-submit">Withdraw</button>
</form>
       {msg && <p className="success-msg">{msg}</p>}
</div>
</>
 );
}