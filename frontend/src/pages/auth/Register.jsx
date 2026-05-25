import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import "./auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullname: "",
    phone: "",
    email: "",
    address: "",
    designation: "",
    branch: "",
    idprooftype: "",
    idproofnumber: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    if (
      !form.fullname ||
      !form.phone ||
      !form.email ||
      !form.address ||
      !form.idprooftype ||
      !form.idproofnumber ||
      !form.password ||
      !form.confirmPassword ||
      !form.role
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (form.role === "EMPLOYEE" && (!form.designation || !form.branch)) {
      alert("Employee registration requires designation and branch");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.phone)) {
      alert("Phone number must be exactly 10 digits");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
    if (!emailRegex.test(form.email)) {
      alert("Enter a valid email");
      return;
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$%^&*!]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      alert(
        "Password must contain:\n\n" +
        "• Minimum 8 characters\n" +
        "• One uppercase letter\n" +
        "• One lowercase letter\n" +
        "• One number\n" +
        "• One special character"
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const email = form.email.trim();

    try {
      //  send email as query param (NO JSON body)
      await API.post("/auth/send-otp", null, { params: { email } });

      alert("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.trim() === "") {
      alert("Enter OTP");
      return;
    }

    const email = form.email.trim();

    try {
      const otpRes = await API.post("/auth/verify-otp", {
        email,
        otp: otp.trim(),
      });

      if (!otpRes.data?.valid) {
        alert("Invalid or expired OTP");
        return;
      }

      localStorage.removeItem("token");
      localStorage.removeItem("userid");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("isLoggedIn");

      const authRes = await API.post("/auth/register", {
        username: email,
        password: form.password,
        role: form.role,
      });

      const userId = authRes.data.userid || authRes.data.id;

      if (!userId) {
        alert("User ID not received");
        return;
      }
      // Create Profile (Based on Role)
      if (form.role === "CUSTOMER") {
        await API.post("/api/customers/register", {
          fullname: form.fullname,
          email,
          phone: form.phone,
          address: form.address,
          idprooftype: form.idprooftype,
          idproofnumber: form.idproofnumber,
          user: { userid: userId, role: "CUSTOMER" },
        });
      } else if (form.role === "EMPLOYEE") {
        await API.post("/api/employees/register", {
          fullname: form.fullname,
          email,
          phone: form.phone,
          address: form.address,
          idprooftype: form.idprooftype,
          idproofnumber: form.idproofnumber,
          designation: form.designation,
          branch: form.branch,
          user: { userid: userId, role: "EMPLOYEE" },
        });
      }

      alert("Registration successful!");
      navigate("/login");
    }
    catch (err) {
      console.error(err);

      // ✅ ✅ SHOW ACTUAL ERROR FROM BACKEND
      if (err.response) {
        const message = err.response.data?.message;

        if (err.response.status === 409) {
          alert(message || "Duplicate data detected");
        } else {
          alert(message || "Registration failed");
        }
      } else {
        alert("Network error");
      }
    }

  };

  return (
    <div className="auth-container">
      <div className="auth-left"></div>

      <div className="auth-card modern">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Open your bank account in a few steps</p>

        {step === 1 && (
          <div className="form-section">
            <div className="form-group">
              <label>Full Name</label>
              <input name="fullname" value={form.fullname} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input name="email" value={form.email} onChange={handleChange} />
            </div>

            <div className="form-group full">
              <label>Address</label>
              <input name="address" value={form.address} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>ID Proof Type</label>
              <select name="idprooftype" value={form.idprooftype} onChange={handleChange}>
                <option value="">Select</option>
                <option value="AADHAR">Aadhar</option>
                <option value="PAN">PAN</option>
                <option value="PASSPORT">Passport</option>
              </select>
            </div>

            <div className="form-group">
              <label>ID Proof Number</label>
              <input name="idproofnumber" value={form.idproofnumber} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Re-enter Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="">Select Role</option>
                <option value="CUSTOMER">Customer</option>
                <option value="EMPLOYEE">Employee</option>
              </select>
            </div>

            {form.role === "EMPLOYEE" && (
              <>
                <div className="form-group">
                  <label>Designation</label>
                  <input name="designation" value={form.designation} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Branch</label>
                  <input name="branch" value={form.branch} onChange={handleChange} />
                </div>
              </>
            )}

            <button className="primary-btn" onClick={sendOtp}>
              Send OTP
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="otp-section">
            <p className="otp-text">Enter the OTP sent to your email</p>

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
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login here</span>
        </p>
      </div>
    </div>
  );
}