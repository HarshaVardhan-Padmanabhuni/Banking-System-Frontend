import { useEffect, useState } from "react";
import API from "../../api/api";
import "./customer.css";
 
export default function Profile() {
 
  const [profile, setProfile] = useState(null);
 
  const userId =
    localStorage.getItem("userid");
 
  const accountId =
    localStorage.getItem("accountid");
 
  useEffect(() => {
 
    fetchProfile();
 
  }, []);
 
  const fetchProfile = async () => {
 
    try {
 
      // GET CUSTOMER DETAILS
      const customerRes = await API.get(
        `/api/customers/by-user/${userId}`
      );
 
      const customer = customerRes.data;
 
      // GET ACCOUNT DETAILS
      const accountRes = await API.get(
        `/accounts/${accountId}`
      );
 
      const account = accountRes.data;
 
      // SET PROFILE
      setProfile({
 
        name:
          customer.fullname ||
 
          localStorage.getItem("username"),
 
        accountNumber:
          account.accountnumber,
 
        email:
          customer.email,
 
        phone:
          customer.phone,
 
        kycStatus:
          customer.kycstatus,
 
        balance:
          account.balance,
 
        accountType:
          account.accounttype
      });
 
    } catch (err) {
 
      console.error(
        "Profile Fetch Error:",
        err
      );
    }
  };
 
  // LOADING
  if (!profile) {
 
    return (
      <div className="customer-page profile-page">
        <div className="profile-card">
          <h2>Loading Profile...</h2>
        </div>
      </div>
    );
  }
 
  return (
 
    <div className="customer-page profile-page">
 
      <div className="profile-card">
 
        <h2 className="profile-title">
          Account Profile
        </h2>
 
        <div className="profile-field">
          <span className="profile-label">
            Name:
          </span>
 
          <span className="profile-value">
            {profile.name}
          </span>
        </div>
 
        <div className="profile-field">
          <span className="profile-label">
            Account Number:
          </span>
 
          <span className="profile-value">
            {profile.accountNumber}
          </span>
        </div>
 
        <div className="profile-field">
          <span className="profile-label">
            Account Type:
          </span>
 
          <span className="profile-value">
            {profile.accountType}
          </span>
        </div>
 
        <div className="profile-field">
          <span className="profile-label">
            Email:
          </span>
 
          <span className="profile-value">
            {profile.email}
          </span>
        </div>
 
        <div className="profile-field">
          <span className="profile-label">
            Phone:
          </span>
 
          <span className="profile-value">
            {profile.phone}
          </span>
        </div>
 
        <div className="profile-field">
          <span className="profile-label">
            KYC Status:
          </span>
 
          <span className="profile-value">
            {profile.kycStatus}
          </span>
        </div>
 
      </div>
 
    </div>
  );
}
 