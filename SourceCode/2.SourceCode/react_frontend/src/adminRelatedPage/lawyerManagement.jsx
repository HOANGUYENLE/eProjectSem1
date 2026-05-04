import PieChart from "../chart/PieChart"
import LineChart from "../chart/LineChart"
import LineStackBar from "../chart/LineStackBar"
import "../css/admin/adminDashBoard.css"
import "../css/searchBar.css"
import axios from "axios"
import { useContext, useEffect } from "react"
import { AuthContext } from "../context/UserContext"
import { useQueries } from "@tanstack/react-query"
import { useState } from "react"

export default function AdminLawyerManagement(){
    const {user, navigate, handleLogout} = useContext(AuthContext);
    const [CityList, addCity] = useState([]);
    const [SpecsList, addSpecs] = useState([]);
    async function fetchLawyerData(){
      const res = await axios.get("/api/allLawyers", {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        }
      });
     
      let arr = res.data.map(lawyer=>{
        return {
            name: lawyer.user_tb.name,
            email: lawyer.user_tb.email,
            address: lawyer.address,
            city: lawyer.city,
            image: lawyer.documentImage || null,
            specialization: Array.isArray(lawyer.specialization) && lawyer.specialization.length > 0 ? lawyer.specialization.map(spec=>{ return spec.name }):  null,
            status: lawyer.status,
            years: lawyer.yearExp,
            availability: Array.isArray(lawyer.availability) && lawyer.availability.length > 0 
            ? lawyer.availability.map(each=>{ 
                return {
                    day_of_week: each.day_of_week,
                    start_time: each.start_time,
                    end_time: each.end_time,
                    is_booked: each.is_booked
                } 
            }) : null,
        };
      });
      
      const AllCities = [...new Set(arr.map(l=>l.city.cityName))];
      addCity(prevState => [...new Set([...prevState, ...AllCities])]);
      return arr;
    }

    async function fetchSpecData(){
        const res = await axios.get("/api/allSpecs", {
            headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
            }
        });
        if (!res.data) {
            return []; // or null, but not undefined
        }
        return res.data
    };

    
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
    const LawyerData = queriesResults[0]
    const SpecData = queriesResults[1];
    useEffect(()=>{
        console.log("fetch Data: ", LawyerData.data, SpecData.data);
    }, [LawyerData.data, SpecData.data]);

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
                    <PieChart label={["Approved Documents", "Pending Documents", "Rejected Documents"]} value={[45, 35, 20]}/>
                </div>
            </div>
            <div className="chartCard lineChart">
                <h5 className="chartTitle">Number of Appointments per Month</h5>
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
                    {CityList.map((value, index) => (
                        <option>{value}</option>
                    ))}
                </select>
            </div>

            <div className="input-group" style={{ maxWidth: "220px" }}>
                <select className="form-select" id="dropdownSpecialization" name="dropdownSpecialization">
                <option defaultValue>Choose Specialization...</option>
                {SpecData.isLoading?<div className="spinner-border"></div>:
                <> {SpecData.data.map((value, index) => (<option key={value.id} value={value.id}>{value.name}</option> ))} </>
                }
                <option value="civil">Civil Law</option>
                <option value="criminal">Criminal Law</option>
                <option value="corporate">Corporate Law</option>
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
                <tr>
                    <th>Lawyer Name</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>Profile Image</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                    {LawyerData.data.map((value, index)=>{return(
                    <tr>
                        <td>{value.name}</td>
                        <td>{value.address}</td>
                        <td>{value.city.cityName}</td>
                        <td><a href={value.image} target="_blank" rel="noopener noreferrer">View image</a></td>
                        <td><span className={value.status === "approve"?"status approved fs-3":"status pending fs-3"}>{value.status}</span></td>
                        <td><div className="actions">
                            <button className="editBtn">Edit</button>
                            <button className="delBtn">Delete</button>
                        </div></td>
                    </tr>)})}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
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