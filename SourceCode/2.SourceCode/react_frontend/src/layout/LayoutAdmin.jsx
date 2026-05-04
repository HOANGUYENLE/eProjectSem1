import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";
import "../css/admin/sidebar.css"
import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { useEffect } from "react";

export default function(){
    const {user, navigate, handleLogout} = useContext(AuthContext);


    return (
        <div className="adminScreen">
          <div className="sidebar">
            <div className="logoContainer">
              <img className="logo ms-auto me-auto" src="/logo/logo.png" alt="App Logo" />
            </div>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
              <li><NavLink to="/admin" end className={({isActive})=>isActive?"nav-link active":"nav-link"}>DashBoard</NavLink></li>
              <li><NavLink to="/admin/lawyerManagement" className={({isActive})=>isActive?"nav-link active":"nav-link"}>Lawyer Management</NavLink></li>
              <li><NavLink to="/admin/userManagement" className={({isActive})=>isActive?"nav-link active":"nav-link"}>User Management</NavLink></li>
              <li><NavLink to="/admin/appointmentOversight" className={({isActive})=>isActive?"nav-link active":"nav-link"}>Appointment Oversight</NavLink></li>
              <li><NavLink to="/admin/FAQManagement" className={({isActive})=>isActive?"nav-link active":"nav-link"}>FAQ Management</NavLink></li>
              <li><NavLink to="/admin/SystemNotification" className={({isActive})=>isActive?"nav-link active":"nav-link"}>System Notification</NavLink></li>
              <hr />
              <li>
                <form>
                  <button type="submit" className="myBtnDanger" onClick={(e)=>handleLogout(e)}>Logout</button>
                </form>
              </li>
            </ul>
          </div>
          <div className="main-content">
            <Outlet/>
          </div>
        </div>
    )
}