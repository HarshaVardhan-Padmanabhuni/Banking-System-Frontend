import { Outlet } from "react-router-dom";
import EmployeeNavBar from "../components/navabars/EmployeeNavBar";

export default function EmployeeLayout() {
  return (
    <>
      <EmployeeNavBar />

      {/*  THIS IS REQUIRED */}
      <div className="container-fluid mt-3">
        <Outlet />
      </div>
    </>
  );
}