import { useNavigate } from "react-router-dom";

import "./customer.css";
export default function CustomerDashboard() {
 const navigate = useNavigate();
 return (
<>

<div className="dashboard-container">
<h2 className="dashboard-title">Welcome to Your Banking Dashboard</h2>
<div className="card-grid">
<div
           className="dashboard-card deposit"
           onClick={() => navigate("/deposit")}
>
<h5>💰 Deposit</h5>
<p>Add money to your account securely</p>
</div>
<div
           className="dashboard-card withdraw"
           onClick={() => navigate("/withdraw")}
>
<h5>💸 Withdraw</h5>
<p>Withdraw funds instantly</p>
</div>
<div
           className="dashboard-card transfer"
           onClick={() => navigate("/transfer")}
>
<h5>🔁 Transfer</h5>
<p>Send money to others easily</p>
</div>
<div
           className="dashboard-card fd"
           onClick={() => navigate("/fixed-deposit")}
>
<h5>📈 Fixed Deposit</h5>
<p>Grow your savings with FD</p>
</div>
<div
           className="dashboard-card rd"
           onClick={() => navigate("/recurring-deposit")}
>
<h5>📅 Recurring Deposit</h5>
<p>Save monthly with RD</p>
</div>
<div
           className="dashboard-card support"
           onClick={() => navigate("/support")}
>
<h5>🛠 Support</h5>
<p>Raise queries or requests</p>
</div>
</div>
</div>
</>
 );
}
