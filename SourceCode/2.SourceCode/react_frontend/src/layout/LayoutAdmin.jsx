import { Outlet, Link, NavLink } from "react-router-dom";
import "../css/admin/sidebar.css"

export default function(){
    return (
        <div className="adminScreen">
          <div className="sidebar">
            <div className="logoContainer">
              <img class="logo ms-auto me-auto" src="/logo/logo.png" alt="App Logo" />
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
                  <button type="submit" className="myBtnDanger">Logout</button>
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