
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"; 
import { Navigation } from "swiper/modules"
import Login from "../../../Auth/Login";
import "swiper/css";
import "swiper/css/navigation";
import { NavLink } from "react-router-dom";

import { Outlet } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../../../context/UserContext"
import { useQueries} from "@tanstack/react-query"
import { useState, useEffect } from "react"
import { fetchCityData } from "../../../apiComponent/apiService"

export default function Nav(){
    const queriesResults = useQueries({
          queries:[
            { queryKey: ["City"],
              queryFn: fetchCityData,
              refetchInterval: 1000 * 60,
            },
          ]
        });
    const CityData = queriesResults[0];
    
    const {user, setUser, saveUserInfo, removeUserInfo, handleLogout, navigate} = useContext(AuthContext);
    const {choosedCity, setChoosedCity} = useState(null);
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
                    <li className="nav-item"> <NavLink to="/" end className={({isActive})=>isActive?"nav-link active":"nav-link"}>Home</NavLink> </li>

                    <li className="nav-item dropdown">
                        <button className="nav-link btn dropdown-toggle" id="searchDropdown2" data-bs-toggle="dropdown" aria-expanded="false">
                            Search lawyer by Location
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="searchDropdown2">
                            {CityData.isLoading ? 
                            <div className="spinner-border"></div>:
                            CityData.data.map((each)=>{
                                if(each.lawyers.length > 0){
                                    return (<li key={each.id} className="dropdown-item">{each.cityName}</li>)
                                }
                            })}
                        </ul>
                    </li>

                    <li className="nav-item dropdown">
                        <NavLink to="/ListOfLawyer" end className={({isActive})=>isActive?"nav-link active":"nav-link" }>View Lawyer List</NavLink>
                    </li>
                    
                    <li className="nav-item">
                        <NavLink to="/faq" end className={({isActive})=>isActive?"nav-link active":"nav-link"}>FAQ/Question List</NavLink>
                    </li>

                    <li className="nav-item dropdown">
                        <NavLink to="/News" end className={({isActive})=>isActive?"nav-link active":"nav-link" }>News</NavLink>
                    </li>
                </ul>
                {!user.token?<><Link to="/login" role="button" className="btn btn-primary">Signin</Link>
                </>:
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