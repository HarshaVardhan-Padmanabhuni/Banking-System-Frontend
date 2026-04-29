import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
export default function Register() {
 const navigate = useNavigate();
 const [form, setForm] = useState({
   name: "",
   phone: "",
   address: "",
   idType: "",
   idNumber: "",
 });
 const [step, setStep] = useState(1);
 const [otp, setOtp] = useState("");
 const [generatedOtp, setGeneratedOtp] = useState("");
 const handleChange = (e) => {
   setForm({ ...form, [e.target.name]: e.target.value });
 };
 const sendOtp = () => {
  
  if (!form.name || !form.phone || !form.address || !form.idType || !form.idNumber) {
  alert("Please fill all fields");
  return;
}
   const otpValue = Math.floor(1000 + Math.random() * 9000).toString();
   setGeneratedOtp(otpValue);
   console.log("OTP:", otpValue);
   setStep(2);
 };
 const verifyOtp = () => {
   if (otp === generatedOtp) {
    localStorage.removeItem("isLoggedIn"); // Clear any existing login
     alert("Registration Successful!");
     navigate("/login");
   } else {
     alert("Invalid OTP");
   }
 };
 return (
<div className="auth-container">
   {/* LEFT SIDE */}
<div className="auth-left">

<div className="features">

</div>
</div>
   {/* RIGHT SIDE */}
<div className="auth-card modern">
<h2 className="auth-title">Create Account</h2>
<p className="auth-subtitle">
       Open your bank account in a few steps
</p>
     {/* STEP 1 */}
     {step === 1 && (
<div className="form-section">
<div className="form-group">
<label>Full Name</label>
<input name="name" onChange={handleChange} required/>
</div>
<div className="form-group">
<label>Phone Number</label>
<input name="phone" onChange={handleChange} required/>
</div>
<div className="form-group full">
<label>Address</label>
<input name="address" onChange={handleChange} required/>
</div>
<div className="form-group">
<label>ID Type</label>
<select name="idType" onChange={handleChange}required>
<option value="">Select</option>
<option>Aadhar</option>
<option>PAN</option>
<option>Passport</option>
</select>
</div>
<div className="form-group">
<label>ID Number</label>
<input name="idNumber" onChange={handleChange} required/>
</div>

<button className="primary-btn" onClick={sendOtp}>
           Send OTP
</button>
</div>
     )}
     {/* STEP 2 */}
     {step === 2 && (
<div className="otp-section">
<p className="otp-text">
           Enter the OTP sent to your number
</p>
<p className="otp-demo">
           OTP (demo): {generatedOtp}
</p>
<input
           className="otp-input"
           placeholder="Enter OTP"
           value={otp}
           onChange={(e) => setOtp(e.target.value)}
         />
<button className="primary-btn" onClick={verifyOtp}>
           Verify & Register
</button>

</div>
     )}
     <p className="register-link">
  Already have an account? <span onClick={() => navigate("/login")}>Login here</span>
</p>
</div>
</div>
 );
}