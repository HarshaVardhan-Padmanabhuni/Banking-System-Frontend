import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import "./auth.css";

export default function Login() {

  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
      const role = localStorage.getItem("role");

      if (role === "CUSTOMER") navigate("/customer");
      else if (role === "EMPLOYEE") navigate("/employee");
    }
  }, [navigate]);

  // ✅ REGISTER PASSKEY (ONLY AFTER PASSWORD LOGIN)
  const handleRegisterPasskey = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/auth/passkeys/registration/options",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { requestId, publicKey } = res.data;

      const convert = (base64) => {
        const padding = "=".repeat((4 - base64.length % 4) % 4);
        const base64Safe = (base64 + padding)
          .replace(/-/g, "+")
          .replace(/_/g, "/");

        const raw = atob(base64Safe);
        return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
      };

      publicKey.challenge = convert(publicKey.challenge);
      publicKey.user.id = convert(publicKey.user.id);

      if (publicKey.excludeCredentials) {
        publicKey.excludeCredentials = publicKey.excludeCredentials.map((cred) => ({
          ...cred,
          id: convert(cred.id),
        }));
      }

      const credential = await navigator.credentials.create({ publicKey });

      await API.post(
        "/auth/passkeys/registration/verify",
        {
          requestId,
          credentialJson: JSON.stringify(credential.toJSON()),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.setItem("passkeyRegistered", "true");

      alert("✅ Passkey registered successfully!");

    } catch (err) {
      // ✅ IMPORTANT: ignore duplicate registration error
      if (err?.name === "InvalidStateError") {
        console.log("Passkey already exists ✅");
        localStorage.setItem("passkeyRegistered", "true");
        return;
      }

      console.error(err);
      alert("Passkey registration failed");
    }
  };

  //  COMMON LOGIN HANDLER
  const handlePostLogin = async (
    token,
    userid,
    role,
    username,
    isPasskeyLogin = false
  ) => {

    localStorage.setItem("token", token);
    localStorage.setItem("userid", userid);
    localStorage.setItem("role", role);
    localStorage.setItem("username", username);
    localStorage.setItem("isLoggedIn", "true");

    // ✅ register passkey for both roles
    if (!isPasskeyLogin) {
      const alreadyRegistered = localStorage.getItem("passkeyRegistered");

      if (!alreadyRegistered) {
        await handleRegisterPasskey();
      }
    }

    // ✅ CUSTOMER FLOW
    if (role === "CUSTOMER") {
      try {
        const customerRes = await API.get(`/api/customers/by-user/${userid}`);
        const customer = customerRes.data;

        localStorage.setItem("name", customer.fullname);
        localStorage.setItem("customerid", customer.customerid);

        const kycStatus =
          (customer.kycstatus || customer.kycStatus || "PENDING").toUpperCase();

        if (!["VERIFIED", "APPROVED"].includes(kycStatus)) {
          alert("KYC not verified");
          return;
        }

        const accountRes = await API.get(
          `/accounts/customer/${customer.customerid}`
        );
        const accounts = accountRes.data;

        if (!accounts || accounts.length === 0) {
          navigate("/open-account");
          return;
        }

        localStorage.setItem("accountid", accounts[0].accountid);
        localStorage.setItem("accountnumber", accounts[0].accountnumber);

        navigate("/customer");

      } catch (err) {
        console.error(err);
        alert("Error loading profile");
      }
    }

    // ✅ EMPLOYEE FLOW
    else if (role === "EMPLOYEE") {
      navigate("/employee");
    }

    else {
      alert("Unauthorized role");
      localStorage.clear();
      navigate("/login");
    }
  };


  // ✅ PASSWORD LOGIN
  const handleLogin = async () => {
    if (!phone || !pin) {
      alert("Enter email and password");
      return;
    }

    try {
      const res = await API.post("/auth/login", {
        username: phone,
        password: pin,
      });

      const { token, userid, role, username } = res.data;

      await handlePostLogin(token, userid, role, username, false);

    } catch (err) {
      console.error(err);
      alert("Invalid credentials");
    }
  };

  // ✅ PASSKEY LOGIN (NO REGISTRATION HERE ❌)
  const handlePasskeyLogin = async () => {
    if (!phone) {
      alert("Enter email first");
      return;
    }

    try {
      const res = await API.post(
        "/auth/passkeys/authentication/options",
        { username: phone }
      );

      const { requestId, publicKey } = res.data;

      const convert = (base64) => {
        const padding = "=".repeat((4 - base64.length % 4) % 4);
        const base64Safe = (base64 + padding)
          .replace(/-/g, "+")
          .replace(/_/g, "/");

        const raw = atob(base64Safe);
        return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
      };

      publicKey.challenge = convert(publicKey.challenge);

      if (publicKey.allowCredentials) {
        publicKey.allowCredentials = publicKey.allowCredentials.map((c) => ({
          ...c,
          id: convert(c.id),
        }));
      }

      const assertion = await navigator.credentials.get({ publicKey });

      const verifyRes = await API.post(
        "/auth/passkeys/authentication/verify",
        {
          username: phone,
          requestId,
          credentialJson: JSON.stringify(assertion.toJSON()),
        }
      );

      const { token, userid, role, username } = verifyRes.data;

      // ✅ ✅ IMPORTANT: pass TRUE
      handlePostLogin(token, userid, role, username, true);

    } catch (err) {
      console.error(err);
      alert("Passkey login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h2>Login</h2>

        <input
          type="text"
          placeholder="Email"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <hr />

        <button onClick={handlePasskeyLogin}>
          Login with Passkey 🔐
        </button>

        <p className="register-link">
          New user?
          <span onClick={() => navigate("/register")}>
            Register here
          </span>
        </p>

      </div>
    </div>
  );
}
