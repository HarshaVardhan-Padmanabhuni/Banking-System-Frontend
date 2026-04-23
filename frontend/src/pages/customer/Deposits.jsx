import { useState } from "react";


export function Deposit() {

    const role = "CUSTOMER";

    const [amount, setAmount] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Deposited: " + amount);
    };

    return (
        <>
            

            <div className="container mt-5 pt-5 w-50">
                <h2>Deposit Money</h2>

                <form onSubmit={handleSubmit}>
                    <input className="form-control mb-3"
                        placeholder="Enter Amount"
                        onChange={(e) => setAmount(e.target.value)} />

                    <button className="btn btn-primary">Deposit</button>
                </form>
            </div>
        </>
    );
}