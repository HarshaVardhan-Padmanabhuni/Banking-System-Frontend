import { useEffect, useState } from "react";
import "./customer.css";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    accountNumber: "",
    email: "",
    phone: "",
    kycStatus: "",
  });

  useEffect(() => {
    // Replace this with your real user source / auth state
    const storedUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

    if (storedUser && storedUser.name) {
      setProfile({
        name: storedUser.name,
        accountNumber: storedUser.accountNumber || storedUser.acNo || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        kycStatus: storedUser.kycStatus || "Pending",
      });
    } else {
      setProfile({
        name: "John Doe",
        accountNumber: "123456789012",
        email: "john.doe@example.com",
        phone: "+91 98765 43210",
        kycStatus: "Pending",
      });
    }
  }, []);

  return (
    <div className="customer-page profile-page">
      <div className="profile-card">
        <h2 className="profile-title">Account Profile</h2>

        <div className="profile-field">
          <span className="profile-label">Name: </span>
          <span className="profile-value">{profile.name}</span>
        </div>

        <div className="profile-field">
          <span className="profile-label">Account Number: </span>
          <span className="profile-value">{profile.accountNumber}</span>
        </div>

        <div className="profile-field">
          <span className="profile-label">Email: </span>
          <span className="profile-value">{profile.email}</span>
        </div>

        <div className="profile-field">
          <span className="profile-label">Phone: </span>
          <span className="profile-value">{profile.phone}</span>
        </div>

        <div className="profile-field">
          <span className="profile-label">KYC Status: </span>
          <span className="profile-value">{profile.kycStatus}</span>
        </div>
      </div>
    </div>
  );
}