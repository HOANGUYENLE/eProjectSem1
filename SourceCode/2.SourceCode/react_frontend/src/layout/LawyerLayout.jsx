import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { lawyerLogout, getCurrentLawyer } from "../services/lawyerApi";
import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import Reminder from "../Customer/Reminder";

export default function LawyerLayout() {

  
  const navigate = useNavigate();
  const currentUser = getCurrentLawyer();

  const {user, handleLogout} = useContext(AuthContext);
  const handleLogout2 = (e) => {
    lawyerLogout();
    handleLogout(e)
  };

  const navClass = ({ isActive }) =>
    `nav-link ${isActive ? "active fw-bold text-primary" : "text-dark"}`;

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container">
          <span className="navbar-brand fw-bold fs-2 btn" onClick={()=>navigate("/")}>LegalEase Lawyer</span>

          <div className="collapse navbar-collapse show">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <NavLink to="/lawyer/dashboard" className={navClass}>
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/lawyer/profile" className={navClass}>
                  Profile
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/lawyer/specializations" className={navClass}>
                  Specializations
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/lawyer/slots" className={navClass}>
                  Availability Slots
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/lawyer/appointment" className={navClass}>
                  Customer Appointments
                </NavLink>
              </li>
              
            </ul>

            <div className="d-flex align-items-center gap-3 fs-3">
              <span>Hello, {currentUser?.name || "lawyer"}</span>
              <div className="nav-item">
                  <Reminder/>
              </div>
              <button className="btn btn-outline-danger btn-sm fs-2" onClick={(e)=>handleLogout2(e)}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Outlet />
      </div>
    </>
  );
}