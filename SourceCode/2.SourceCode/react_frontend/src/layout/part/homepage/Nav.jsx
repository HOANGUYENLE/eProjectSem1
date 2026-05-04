import { Outlet } from "react-router-dom"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"; 
import { Navigation } from "swiper/modules"
import { useContext } from "react"
import { AuthContext } from "../../../context/UserContext"
import Login from "../../../Auth/Login";
import "swiper/css";
import "swiper/css/navigation";
import axios from "axios";

export default function Nav(){
    const navigate = useNavigate();
    const {user, setUser, saveUserInfo, removeUserInfo, handleLogout} = useContext(AuthContext)
    
    console.log(user);
    return (<>
    <nav className="navbar navbar-expand-lg navbar-light bg-light p-3">
        <div className="container-fluid">
            <Link className="navbar-brand fw-bold" to="/">
                <img 
                src="/logo/logo.png"  
                alt="LegalEase Logo"
                height="60"              
                width="70"
                className="d-inline-block align-text-top"/>
            </Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuList" aria-controls="menuList">
                <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="menuList">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>
                    
                    <li className="nav-item dropdown">
                        <button className="nav-link btn dropdown-toggle" id="searchDropdown1" data-bs-toggle="dropdown" aria-expanded="false">
                            Search lawyer by Specialization
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="searchDropdown1">
                            <li><a className="dropdown-item" href="#">All Specializations</a></li>
                            <li><a className="dropdown-item" href="#">Family Law</a></li>
                            <li><a className="dropdown-item" href="#">Corporate Law</a></li>
                            <li><a className="dropdown-item" href="#">Criminal Law</a></li>
                            <li><a className="dropdown-item" href="#">Litigation</a></li>
                            <li><a className="dropdown-item" href="#">Securities Law</a></li>
                        </ul>
                    </li>

                    <li className="nav-item dropdown">
                        <button className="nav-link btn dropdown-toggle" id="searchDropdown2" data-bs-toggle="dropdown" aria-expanded="false">
                            Search lawyer by Location
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="searchDropdown2">
                            <li><a className="dropdown-item" href="#">All Locations</a></li>
                            <li><a className="dropdown-item" href="#">Ho Chi Minh City</a></li>
                            <li><a className="dropdown-item" href="#">Hà Nội</a></li>
                            <li><a className="dropdown-item" href="#">Đà Nẵng</a></li>
                            <li><a className="dropdown-item" href="#">Cần Thơ</a></li>
                        </ul>
                    </li>

                    <li className="nav-item dropdown">
                        <button className="nav-link btn" id="LawyerList" onClick={()=>navigate("/ListOfLawyer")}>View Lawyer List</button>
                    </li>
                    
                    <li className="nav-item">
                        <Link className="nav-link" to="/FAQ">FAQ/Question</Link>
                    </li>
                </ul>
                {!user.token?
                    <ul className="navbar-nav mb-2 mb-lg-0">
                    <li className="nav-item">
                        <button
                            type="button"
                            className="btn btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#SigninBtn">
                            Signin
                        </button>
                        <div className="modal fade" tabIndex={-1} id="SigninBtn" aria-labelledby="SigninTitle">
                            <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h2 id="SigninTitle" className="modal-title text-center w-100 fw-bolder"> Sign in </h2>
                                </div>
                                <div className="modal-body"> <Login/></div>
                                <div className="modal-footer d-flex justify-content-center">
                                    <button className="btn text-center" data-bs-toggle="modal" data-bs-target="#SigninBtn" onClick={()=>navigate("/signup")}>Don't have account? Just sign up</button>
                                </div>
                            </div>
                            </div>
                        </div>
                    </li>
                </ul>
                :
                <ul className="nav navbar-nav navbar-right">
                    {user.role !== "admin"?
                    <>
                    <li className="nav-item dropdown">
                        <button className="nav-link btn" id="notificationDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                            <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
                                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 
                                1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.
                                447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                            </svg>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-lg-end" aria-labelledby="notificationDropdown">
                            <li><a className="dropdown-item" href="#">Action 1</a></li>
                            <li><a className="dropdown-item" href="#">Another action 1</a></li>
                        </ul>
                    </li>
                    <li>
                        <a role="button" className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="/logo/iconProfile.png" className="iconImg" alt="profile" /></a>
                        <ul className="dropdown-menu dropdown-menu-end profileList">
                            <li className="fw-bolder fs-2 text-center">{user.name}</li>
                            <li><hr className="dropdown-divider"></hr></li>
                            <li><button className="dropdown-item" type="button" onClick={()=>navigate("/userInfo")}>Profile</button></li>
                            <li><button className="dropdown-item" type="button">My Appointment</button></li>
                            <li><button className="dropdown-item" type="button">Booking History</button></li>
                            <li><hr className="dropdown-divider"></hr></li>
                            <li><button className="dropdown-item btn-danger" type="button" onClick={(e)=>handleLogout(e)}>Logout</button></li>
                        </ul>
                    </li>
                    </>:<><li><a role="button"><img src="/logo/iconProfile.png" className="iconImg" alt="profile" onClick={()=>navigate("/admin")}/></a></li></>}
                </ul>
                }
            </div>
            </div>
    </nav>
    </>)
}