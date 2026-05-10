import "../css/admin/userTable.css"
import "../css/searchBar.css"
import BarChart from "../chart/BarChart";
import { useEffect, useState } from "react";
import { fetchAppointmentData } from "../apiComponent/apiService";
import { useQueries, useQueryClient } from "@tanstack/react-query"
import { AuthContext } from "../context/UserContext";
import { useContext } from "react";

export default function AdminAppointment(){
    const queryClient = useQueryClient();
    const {user, navigate, formatTime, formatDate} = useContext(AuthContext);
    const DayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [AppointmentType, setAppointmentType] = useState("default");
    const [Search, setSearch] = useState("");
    const [BarData, setBarData] = useState([]);
    const [visibleCount, setVisibleCount] = useState(3);
    const [rawData, setRawData] = useState(null);
    const [displayData, setDisplayData] = useState(null);
    
    let barDataset = [{label:"Peak Appointment in days", data: BarData, backgroundColor: "#3B82F6", borderColor: "#2563EB", borderWidth: 1}]
    const handleAppointmentType = (value)=>{
        setAppointmentType(value);
    }
    const [columnYear, setColumnYear] = useState("2025");
    const queriesResults = useQueries({
          queries:[
            { queryKey: ["apointmentData", columnYear],
              queryFn: fetchAppointmentData,
              refetchInterval: 1000 * 60,
              enabled: !!columnYear
            }
          ]
        });

    const AppointmentData = queriesResults[0];
    useEffect(()=>{
      if(AppointmentData?.data){
        let dataset = new Array(7).fill(0);
        AppointmentData.data.AppointmentData.map((each)=>{
          const date = new Date(each.created_at);
          let dayOfWeek = date.getDay();
          dataset[dayOfWeek] += 1;
        })
        setBarData(dataset);

        setRawData(AppointmentData.data);
        setDisplayData(AppointmentData.data)
      }
    }, [AppointmentData.data])

    useEffect(()=>{
        setVisibleCount(3);
        setSearch("");
        if(AppointmentType !== "default"){ 
          const filterData = rawData?.AppointmentData.filter(each=>{
          let eachState = each.status === "completed"? 
          ((each.reschedules.length > 0) ? (each.reschedules[each.reschedules.length-1].status === "rescheduled" ? "completed" : "canceled") : each.status)
          : each.status;
          return eachState === AppointmentType;})
          //
          //console.log(AppointmentData.data, filterData);
          setDisplayData({"AppointmentData": filterData})
        }
        else{
          setDisplayData(rawData);
        }
      },[rawData, AppointmentType])

      useEffect(()=>{
        },[Search])

      const trySearch = (e)=>{
        e.preventDefault();
        setVisibleCount(3);
        if(Search !== ""){ 
            const filterData = rawData?.AppointmentData.filter(each=>{
              const lawyerName = each.lawyer.user_tb.name;
              const CustomerName = each.user_tb.name;
              console.log(lawyerName, CustomerName)
              if(lawyerName.includes(Search)){
                return true;
              }
              if(CustomerName.includes(Search)){
                return true;
              }
            })
            setDisplayData({"AppointmentData": filterData})
          }
        else{
          setDisplayData(AppointmentData.data);
        }
      }

    const handleLineChart = (e)=>{
        setColumnYear(e.target.value);
        queryClient.invalidateQueries(["apointmentData", columnYear]);
    }
    return(
      <div className="ContentBodyDashboard">
       <h2 className="fs-1 fw-bolder">Appointment Oversight</h2>
        <div className="chartRow-2 ">
            <div className="chartCard columnChart">
                <h5 className="chartTitle">Peak Appointment days in week</h5>
                <div style={{height: "220px", maxWidth: "1200px"}}>
                    <BarChart datasets={barDataset} labels={DayLabels}/>
                </div>
            </div>
        </div>
        <hr />
        <div className="SearchBar">
        <div className="SearchBar d-flex align-items-center gap-3">
            <div className="input-group" style={{ maxWidth: "250px" }}>
                <select className="form-select" id="dropdownCity" name="dropdownCity" value={AppointmentType || "default"} onChange={(e)=>setAppointmentType(e.target.value)}>
                    <option value="default">Choose type Appointment</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                </select>
            </div>

            <form method="get" className="navbar-form flex-grow-1" onSubmit={(e)=>trySearch(e)}>
                <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search Customer or Lawyer Name"
                    value={Search} onChange={(e)=>setSearch(e.target.value)}
                />
                <button className="btn btn-secondary" type="submit">
                    <i className="fa fa-search"></i>
                </button>
                </div>
            </form>

            {AppointmentData.isLoading? <div className="spinner-border"></div> :
            <div className="input-group w-25">
                <select className="form-select w- fs-2" value={columnYear} 
                onChange={(e)=>{ handleLineChart(e); }}>
                    {AppointmentData.data.allYears.map((each)=>(
                        <option value={each}>{each}</option>))}
                </select>
            </div>}
            </div>
      </div>
        {AppointmentData.isLoading?<div className="spinner-border"></div>:<>
        <table className="user-table">
            <thead>
            <tr>
                <th>Customer Name</th>
                <th>Lawyer Name</th>
                <th>Time</th>
                <th>Have Rescheduled</th>
                <th>Appointment Status</th>
            </tr>
            </thead>
             <tbody>
                {displayData?.AppointmentData.slice(0, visibleCount).map((each)=>(
                    <tr className="fs-2" key={each.id}>
                        <td>{each.user_tb.name}</td>
                        <td>{each.lawyer.user_tb.name}</td>
                        <td>{
                            each.reschedules.length > 0 ? 
                            <>{formatDate(each.reschedules[each.reschedules.length-1].created_at) + 
                                ", " + formatTime(each.slot.start_time) + " - " + formatTime(each.slot.end_time)}</>:
                                <>{formatDate(each.created_at) + ", " + formatTime(each.slot.start_time) + " - " + formatTime(each.slot.end_time)}</>
                            }</td>
                        <td>
                            {each.reschedules.length > 0 ? 
                            <button className="btn btn-primary fs-3" data-bs-toggle="modal" data-bs-target={`#scheduleModal-${each.id}`}>Have Rescheduled, view detail.</button> 
                            :<button className="btn btn-secondary fs-3">No Rescheduled</button>}
                        </td>
                        <td><span className={each.status === "completed"? ((each.reschedules.length > 0 ? (each.reschedules[each.reschedules.length-1].status === "canceled" ? "btn btn-danger fs-3" : "btn btn-success fs-3"): "btn btn-success fs-3")): "btn btn-warning fs-3"}>
                            {each.status === "completed"? (
                                each.reschedules.length > 0 ? 
                                each.reschedules[each.reschedules.length-1].status === "rescheduled" ?
                                "completed" : "canceled":
                                each.status): each.status}</span></td>
                        </tr>
                ))}
            </tbody>
        </table>
          {visibleCount < displayData?.AppointmentData.length && 
          <div className="d-flex justify-content-center w-100">
            <button
              className="btn btn-primary mt-3 fs-1"
                onClick={() => setVisibleCount(visibleCount + visibleCount)}>
              Load More
            </button>
            </div>
          }
        
        </>}
        
        
        {AppointmentData?.data && AppointmentData.data.AppointmentData.map((each) => (
        <div className="modal fade" id={`scheduleModal-${each.id}`} tabIndex={-1} key={each.id}>
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title fs-1 fw-bolder">Appointment #{each.id} Details</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                    <form>
                        {/* Customer */}
                        <div className="mb-3">
                        <label className="form-label">Customer</label>
                        <input type="text" className="form-control" value={each.user_tb.name} readOnly />
                        </div>

                        {/* Lawyer */}
                        <div className="mb-3">
                        <label className="form-label">Lawyer</label>
                        <input type="text" className="form-control" value={each.lawyer.user_tb.name} readOnly />
                        </div>

                        {/* Reschedule history */}
                        <div className="mb-3">
                          <label className="form-label">Reschedule History</label>
                          {each.reschedules.length > 0 ? (
                            <div className="accordion" id={`accordion-${each.id}`}>
                              {each.reschedules.map((r, idx) => {
                                const oldStart = r.old_slot?.start_time || "00:00";
                                const oldEnd   = r.old_slot?.end_time   || "00:00";
                                const newStart = r.new_slot?.start_time || null;
                                const newEnd   = r.new_slot?.end_time   || null;
                                const status   = r.status; 
                                const reason   = r.reason || "No Reason";

                                return (
                                  <div className="accordion-item" key={idx}>
                                    <h2 className="accordion-header" id={`heading-${each.id}-${idx}`}>
                                      <button
                                        className="accordion-button collapsed fs-3"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#collapse-${each.id}-${idx}`}
                                        aria-expanded="false"
                                        aria-controls={`collapse-${each.id}-${idx}`}
                                      >
                                        Reschedule {idx + 1}
                                      </button>
                                    </h2>
                                    <div
                                      id={`collapse-${each.id}-${idx}`}
                                      className="accordion-collapse collapse fs-3"
                                      aria-labelledby={`heading-${each.id}-${idx}`}
                                      data-bs-parent={`#accordion-${each.id}`}
                                    >
                                      <div className="accordion-body">
                                        <div className="fw-bold">
                                          {formatDate(each.updated_at)} | {formatTime(oldStart)}-{formatTime(oldEnd)} → {!newStart && !newEnd?"Canceled":formatDate(r.created_at) +" | " + formatTime(newStart) + "-" +formatTime(newEnd)}
                                        </div>
                                        <div>Status: {status}</div>
                                        <div>Reason: {reason}</div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        ) : (
                          <span>No reschedules yet</span>
                        )}
</div>
            {/* Final status */}
            <div className="mb-3">
              <label className="form-label">Final Status</label>
              <input
                type="text"
                className="form-control"
                value={
                  each.reschedules.length === 0
                    ? each.status
                    : each.status === "completed"
                      ? (each.reschedules[each.reschedules.length - 1].status === "canceled"
                          ? "canceled"
                          : "completed")
                      : each.status
                }
                readOnly
              />
            </div>

            {/* Request text */}
            <div className="mb-3">
              <label className="form-label">Request Text</label>
              <textarea rows={3} className="form-control p-2" value={each.request_text || "null"} readOnly />
            </div>

            {/* Response text */}
            <div className="mb-3">
              <label className="form-label">Response Text</label>
              <textarea rows={3} className="form-control p-2" value={each.response_text || "No responsed"} readOnly />
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
))}
        </div>
    )
}