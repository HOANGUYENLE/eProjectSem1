import PieChart from "../chart/PieChart"
import LineChart from "../chart/LineChart"
import LineStackBar from "../chart/LineStackBar"
import "../css/admin/adminDashBoard.css"
import "../css/searchBar.css"
import axios from "axios"
import { useContext, useEffect } from "react"
import { AuthContext } from "../context/UserContext"
import { useQueries, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { fetchLawyerData, fetchSpecData, ConfirmLawyerFile } from "../apiComponent/apiService"

export default function AdminLawyerManagement(){
    const queryClient = useQueryClient();
    useEffect(()=>{window.scrollTo(0, 0)},[])
    const {user, navigate, handleLogout} = useContext(AuthContext);
    const [CityList, addCity] = useState([]);
    const [SpecsList, addSpecs] = useState([]);
    const [Status, setStatus] = useState(null);

    const [pieChartStatus, setPieCharStatus] = useState(null);

    const queriesResults = useQueries({
      queries:[
        { queryKey: ["lawyer"],
          queryFn: fetchLawyerData,
          refetchInterval: 1000 * 60
        },
        { queryKey: ["specs"],
          queryFn: fetchSpecData,
          refetchInterval: 1000 * 60
        }
      ]
    });

    const LawyerData = queriesResults[0];
    const SpecData = queriesResults[1];

    useEffect(()=>{
        //console.log("fetch Data: ", LawyerData.data, SpecData.data);
        if(LawyerData?.data){
           
            const AllCities = [...new Set(LawyerData.data.map(l=>l.city.cityName))];
            addCity(prevState => [...new Set([...prevState, ...AllCities])]);
                        
            const countingStatus = LawyerData.data.reduce((initStat, each)=>{
                initStat[each.status] = (initStat[each.status] || 0) + 1
                return initStat;
            }, {});

            setPieCharStatus([
                countingStatus.approve || 0,
                countingStatus.pending || 0,
                countingStatus.reject || 0,
            ]);
        }

    }, [LawyerData.data, SpecData.data]);

    const handleStatus = (value) => {
        setStatus({"status": value});
    }

    const approveLawyer = async (lawyer_id, value)=>{
        let response = await ConfirmLawyerFile(lawyer_id, Status);
        if(response){
            setStatus(null);
            queryClient.invalidateQueries(["lawyer"]);
        }
    }

    const formatTime = (timeStr)=>{
        const date = new Date(`1970-01-01T${timeStr}`);
        return new Intl.DateTimeFormat("vi-VN", {
            hour: "2-digit",
            minute: "2-digit"
        }).format(date);
    }

    let datasets = {
        'success': [25, 30, 28, 35, 40, 38, 23, 21, 23, 28, 35, 21],
        'cancel' : [15, 18, 22, 20, 25, 28, 30, 28, 35, 23, 21, 23],
        'total': [48, 58, 62, 70, 75, 78, 62, 70 , 58, 62, 21, 30]
    }
   
    let labels = {
        'success': "Successful Appointment",
        'cancel':  "Canceled Appointment",
        'total': "Total Appointment"
    }
    return (<>
    <div className="ContentBodyDashboard">
        <div className="chartRow-3">
            <div className="chartCard circleChart">
                <h5 className="chartTitle">Pending Lawyer documents</h5>
                <div style={{height: "200px", position: "relative", width:"100%" ,maxWidth: "400px"}}>
                    {!pieChartStatus ? <div className="spinner-border"></div>: <PieChart label={["Approved Documents", "Pending Documents", "Rejected Documents"]} value={pieChartStatus}/>}
                    
                </div>
            </div>
            <div className="chartCard lineChart">
                <h5 className="chartTitle">Number of appointments per month</h5>
                <div style={{height: "200px", width:"100%" ,maxWidth: "600px"}}>
                    <LineStackBar datasets={datasets} labels={labels}/>
                </div>
            </div>
        </div>
        <hr />

        <div className="SearchBar d-flex align-items-center gap-3">
            <form method="get" className="navbar-form flex-grow-1">
                <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search Lawyer by Name"
                />
                <button className="btn btn-secondary">
                    <i className="fa fa-search"></i>
                </button>
                </div>
            </form>

            <div className="input-group" style={{ maxWidth: "200px" }}>
                <select className="form-select" id="dropdownCity" name="dropdownCity">
                    <option defaultValue>Choose City...</option>
                    {CityList.map((value, index) => (<option>{value}</option> ))}
                </select>
            </div>

            <div className="input-group" style={{ maxWidth: "220px" }}>
                <select className="form-select" id="dropdownSpecialization" name="dropdownSpecialization">
                    <option defaultValue>Choose Specialization...</option>
                    {SpecData?.data && SpecData.data.map((value, index) => (<option key={value.id} value={value.id}>{value.name}</option> )) }
                </select>
            </div>

            <div className="dropdown">
                <button
                className="btn btn-outline-primary dropdown-toggle"
                type="button"
                id="filterDropdown"
                data-bs-toggle="dropdown"> Filter </button>
                <ul className="dropdown-menu p-3 mt-1 fs-3">
                    <li>
                        <div className="form-check">
                        <input className="form-check-input" type="radio" name="sortOption" id="sortNameAsc" />
                        <label className="form-check-label" htmlFor="sortName">Sort by Name (ASC)</label>
                        </div>
                        <div className="form-check">
                        <input className="form-check-input" type="radio" name="sortOption" id="sortNameDesc" />
                        <label className="form-check-label" htmlFor="sortName">Sort by Name (DESC)</label>
                        </div>
                    </li>
                    <li>
                        <div className="form-check">
                        <input className="form-check-input" type="radio" name="sortOption" id="sortExpAsc" />
                        <label className="form-check-label" htmlFor="sortExpAsc">Sort by Experience (ASC)</label>
                        </div>
                    </li>
                    <li>
                        <div className="form-check">
                        <input className="form-check-input" type="radio" name="sortOption" id="sortExpDesc" />
                        <label className="form-check-label" htmlFor="sortExpDesc">Sort by Experience (DESC)</label>
                        </div>
                    </li>
                </ul>
            </div>
            </div>
        </div>
        {LawyerData.isLoading? <div className="spinner-border"></div>:
        <div className="LawyerTable fs-3">
            <table>
                <thead>
                <tr >
                    <th>Lawyer Name</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>Profile Image</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                    {LawyerData.data.map((value, index)=>{
                    return(
                        <tr key={value.id}>
                            <td>{value.name}</td>
                            <td>{value.address}</td>
                            <td>{value.city.cityName}</td>
                            <td><a href={value.image} target="_blank" rel="noopener noreferrer">View image</a></td>
                            <td><span className={value.status === "approve"?"status approved fs-3":value.status === "pending"?"status pending fs-3":"status rejected fs-3"}>{value.status}</span></td>
                            <td><div className="actions d-flex justify-content-start">
                                <button type="button" className="btn btn-info p-3" data-bs-toggle="modal" data-bs-target={`#lawyerModal-${value.id}`} onClick={()=>handleStatus(value.status)}>See Detail info</button>
                            </div></td>
                        </tr>)})}
                </tbody>
            </table>
                    
            {LawyerData?.data && LawyerData.data.map((value, index)=>{
                return (
                    <>
                    <div className="modal fade" id={`lawyerModal-${value.id}`} tabIndex={-1}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title fs-1 fw-bolder" id={`lawyerModalLabel-${value.id}`}>Lawyer {value.name} information</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="mb-3">
                                            <label className="form-label">Name</label>
                                            <input type="text" className="form-control" value={value.name} readOnly />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input type="email" className="form-control" value={value.email} readOnly />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Address</label>
                                            <input type="text" className="form-control" value={value.address} readOnly />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">City</label>
                                            <input type="text" className="form-control" value={value.city?.cityName} readOnly />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Image</label>
                                            {value.image?<a role="button" className="fs-2 p-2 d-block nav-link" href={value.image} target="_blank" rel="noopener noreferrer">View Image</a>: <span>No image</span>}
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Specialization</label>
                                            <input type="text" className="form-control" value={value.specialization?value.specialization.join(", ") : "No specialization yet"} readOnly />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Status</label>
                                            <select class="form-select form-control" value={!Status?value.status:Status.status} onChange={(e)=>handleStatus(e.target.value)}>
                                                <option value="pending">Pending</option>
                                                <option value="reject">Reject</option>
                                                <option value="approve">Approve</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Years of Experience</label>
                                            <input type="number" className="form-control" value={value.years} readOnly />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Available Time</label>
                                            <textarea rows={!value.availability?4:value.availability.length} className="form-control p-2" 
                                            value={!value.availability?"No available time yet": 
                                                    value.availability.map((each)=>`${each.day_of_week} ${formatTime(each.start_time)}-${formatTime(each.end_time)}, ${each.is_booked?"Booking": "Free"}`).join("\n")} readOnly/>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={(e)=>approveLawyer(value.id ,Status)}>Save changes</button>
                                </div>
                            </div>
                            </div>
                        </div>
                    </>
                )
            })}
            {/* Pagination */}
            <div className="pagination mt-5">
                <button disabled>Previous</button>
                <button className="active">1</button>
                <button>2</button>
                <button>3</button>
                <button>Next</button>
            </div>
            </div>
        }
        

    </>)
}