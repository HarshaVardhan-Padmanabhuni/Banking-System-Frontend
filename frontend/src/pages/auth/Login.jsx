import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
export default function Login() {
 const navigate = useNavigate();
 const [phone, setPhone] = useState("");
 const [pin, setPin] = useState("");
 // 🔥 Auto redirect if already logged in

 // 🔥 Handle login
 const handleLogin = () => {
   if (phone && pin) {
     localStorage.setItem("isLoggedIn", "true"); // ✅ save login
     navigate("/customer");
   } else {
     alert("Please enter phone number and PIN");
   }
 };
return (
<div className="login-page">
<div className="login-card">
<h2>Login</h2>
<input
       type="text"
       placeholder="Phone Number"
       value={phone}
       onChange={(e) => setPhone(e.target.value)}
     />
<input
       type="password"
       placeholder="PIN"
       value={pin}
       onChange={(e) => setPin(e.target.value)}
     />
<button onClick={handleLogin}>Login</button>
<p className="register-link">
       New user? <span onClick={() => navigate("/register")}>Register here</span>
</p>
</div>
</div>
);
}