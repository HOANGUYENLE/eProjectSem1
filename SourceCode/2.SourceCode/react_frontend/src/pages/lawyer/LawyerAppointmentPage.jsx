
import { useEffect, useEffectEvent, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/UserContext";
import {  useQueries, useQueryClient } from "@tanstack/react-query";
import { fetchAppointmentData, fetchTakeAppointment, fetchResponseAppointment, fetchRegisterReschedule, fetchDoneAppointment} from "../../apiComponent/apiService";
import "../../css/lawyer/lawyerAppointment.css"

export default function LawyerAppointment(){
    const [sortOrder, setSortOrder] = useState("asc");
    const queryClient = useQueryClient();
    useEffect(()=>{window.scrollTo(0, 0)},[]);
    const {user, navigate, formatTime, calDayAhead} = useContext(AuthContext);
    const [displayData, setDisplayData] = useState(null)
    const [response, setResponse] = useState({
        "response_text": ""
    });
    const queriesResults = useQueries({
        queries:[
        { queryKey: ["lawyerAppoinment", user.token],
            queryFn: fetchTakeAppointment,
            refetchInterval: 1000 * 60,
        }]
    });

    const appointmentData = queriesResults[0];

    useEffect(()=>{
        if(appointmentData?.data){
            console.log(appointmentData.data);
            setDisplayData(appointmentData.data);
        }
    }, [appointmentData])

    useEffect(()=>{
        //console.log(response);
    }, [response])

    const cancelBooking = (e, appt)=>{
      e.preventDefault();
      if(window.confirm("Are you sure you can to cancel this appointment?")){
  
        const temp = {
          'appointment_id': appt.id,
          'old_slot_id': appt.slot_id,
          'new_slot_id': null,
          'reason': null
        }
  
        const res = fetchRegisterReschedule("cancel", temp);
        if(res){
          alert("You have canceled this schedule: " + calDayAhead(appt.day_of_week, appt.updated_at) + " with Customer " + appt.user_tb.name);
          setTimeout(() => {
            navigate("/"); // replace with your route
          }, 2000);
        }
      }
    }
    const confirmBooking = (e, appt) =>{
      e.preventDefault();
      if(window.confirm("Will this appointment be consider done?")){
  
        const res = fetchDoneAppointment(appt.id);
        if(res){
          alert("You have complete this schedule: " + calDayAhead(appt.day_of_week, appt.updated_at) + " with Customer " + appt.user_tb.name);
          setTimeout(() => {
            navigate("/"); // replace with your route
          }, 2000);
        }
      }
    }
    const saveResponse = async (AppointmentId)=>{
        
        const res = fetchResponseAppointment(AppointmentId, response);
        if (res){
            alert("You have responsed an appointment");
            return
        }
    }
    
    if (appointmentData.isLoading) return <div className="spinner-border"></div>;
    if (appointmentData.error) return <div>Error loading appointments</div>;



    return (
<div className="lawyerBooking fs-3">
  <h1 className="mb-4 fw-bold">Your Appointments</h1>
    
  <table className="table table-striped table-bordered">
    <thead>
      <tr>
        <th>Customer</th>
        <th>Appointment Date</th>
        <th>Time</th>
        <th>Customer Request</th>
        <th>Your Response</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {displayData?.map((appt) => (
        <tr key={appt.id}>
          <td className="p-5">{appt.user_tb.name}</td>
          <td>{calDayAhead(appt.slot.day_of_week, appt.updated_at)}</td>
          <td>{`${formatTime(appt.slot.start_time)} - ${formatTime(appt.slot.end_time)}`}</td>
          <td>{appt.request_text || "No request provided"}</td>
          <td>{appt.response_text || "No response yet"}</td>
          <td>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-info fs-4"
                data-bs-toggle="modal"
                data-bs-target={`#bookingModal-${appt.id}`}
                onClick={()=>setResponse({...response, response_text:appt.response_text?appt.response_text:""})}
                >
                View Booking
              </button>

              <button
                type="button"
                className="btn btn-success fs-4"
                onClick={(e) => confirmBooking(e, appt)}
              >
                Confirm Done
              </button>

              <button
                type="button"
                className="btn btn-danger fs-4"
                onClick={(e) => cancelBooking(e, appt)}
              >
                Cancel Booking
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Modals */}
  {displayData?.map((appt) => (
    <div
      className="modal fade"
      id={`bookingModal-${appt.id}`}
      key={appt.id}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title fs-2 fw-bold">
              Booking with {appt.user_tb.name}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={appt.user_tb.name}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Appointment Date</label>
                <input
                  type="text"
                  className="form-control"
                  value={calDayAhead(appt.slot.day_of_week, appt.updated_at)}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Working Time</label>
                <input
                  type="text"
                  className="form-control"
                  value={`${formatTime(appt.slot.start_time)} - ${formatTime(appt.slot.end_time)}`}
                  readOnly/>
              </div>
              <div className="mb-3">
                <label className="form-label">Customer Request</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={appt.request_text || "No request provided"}
                  readOnly
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Your Response</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={response.response_text}
                  onChange={(e) => setResponse({...response, response_text: e.target.value})}
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary fs-4"
              data-bs-dismiss="modal"> Close
            </button>
            <button
              type="button"
              className="btn btn-info fs-4"
              onClick={() => saveResponse(appt.id)}
              data-bs-dismiss="modal">
              Save Response
            </button>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

    )
}