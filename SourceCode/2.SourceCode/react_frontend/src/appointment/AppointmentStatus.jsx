
// src/pages/AppointmentStatus.js
import React  from "react";
import {
  FaCalendarAlt,
  FaUserAlt,
  FaClock,
  FaTrashAlt,
  FaCommentDots,
  FaRedoAlt,
  FaTimes,
  FaStar,
  FaBriefcase
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "../css/appointment/appointmentStatus.css"

import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { useParams } from "react-router-dom";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { fetchTakeAppointment , fetchRegisterReschedule} from "../apiComponent/apiService";
import { useState } from "react";
import { useEffect } from "react";

export default function AppointmentStatus() {
  useEffect(()=>{window.scrollTo(0, 0)},[])
  const queryClient = useQueryClient();
  const {user, navigate, calDayAhead, formatTime, RatingCal} = useContext(AuthContext);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const selectLawyer = (lawyer) => {
    setSelectedLawyer(lawyer);
    setShowDetails(true);
  };

  const queriesResults = useQueries({
      queries:[
        { queryKey: ["Appointment", user.name],
          queryFn: fetchTakeAppointment,
          refetchInterval: 1000 * 60,
          enabled: !!user.token
        },
      ]
  });
  
  const AppointmentData = queriesResults[0];
  useEffect(()=>{
    if(AppointmentData?.data){
      console.log(AppointmentData.data);
    }
  }, [AppointmentData.data])

  useEffect(()=>{
    //console.log(selectedLawyer.slot)
  }, [selectLawyer])

  const getStatusText = (status) => {
    switch(status) {
      case 'online': return 'Available';
      case 'busy': return 'Busy';
      default: return 'Offline';
    }
  };

  const handleCancel = (e, selected)=>{
    e.preventDefault();
    console.log(selected);
    if(window.confirm("Are you sure you can to cancel this appointment?")){

      const temp = {
        'appointment_id': selected.id,
        'old_slot_id': selected.slot_id,
        'new_slot_id': null,
        'reason': null
      }

      const res = fetchRegisterReschedule("cancel", temp);
      if(res){
        alert("You have canceled schedule: " + calDayAhead(selected.slot.day_of_week, selected.updated_at) + " with Lawyer " + selected.lawyer.user_tb.name);
        setTimeout(() => {
          navigate("/"); // replace with your route
        }, 2000);
      }
    }
  }

  return (
    <div className="pending-wrapper appointmentRes mt-5">
      {/* HEADER */}
      <div className="pending-header">
        {AppointmentData?.isLoading ? (
          <div className="spinner-border"></div>
        ) : AppointmentData?.data && AppointmentData.data.length > 0 ? (
          <>
            <div className="pending-icon">⏳</div>
            <h1>Appointment is Pending</h1>
            <p>Your appointment request has been received. Select a lawyer to proceed</p>
          </>
        ) : (
          <>
            <div className="pending-icon">📭</div>
            <h1>No Appointment Found</h1>
            <p>You currently don’t have any appointments scheduled. Please create a new request to get started.</p>
          </>
        )}
      </div>

      {/* LAWYER GRID */}
      <div className="lawyer-grid">
        {AppointmentData.isLoading?
          <div className="spinner-border"></div>:
          AppointmentData.data.map((each)=>{
            return(
            <div key={each.id} className="lawyer-card">
              <div className="lawyer-top">
                <img src={each.lawyer.documentImage} alt={each.lawyer.user_tb.name} />
                <div className={`lawyer-status ${each.status}`}>
                  {each.status}
                </div>
              </div>
              <h3>{each.lawyer.user_tb.name}</h3>
              <span>{each.lawyer.user_tb.email}</span>

              <div className="lawyer-info d-flex justify-content-center">
                <div className="ms-5 me-5">
                  <strong>{each.lawyer.yearExp}</strong>
                  <p>Years</p>
                </div>

                <div className="ms-5 me-5">
                  <strong>{RatingCal(each.lawyer.reviews)}</strong>
                  <p>Rating</p>
                </div>
              </div>

              <button onClick={() => selectLawyer(each)}>
                Select Lawyer
              </button>
            </div>
          )})
        }
      </div>

      {/* APPOINTMENT DETAILS */}
      {selectedLawyer && showDetails && (
        <div className="pending-main-card">
          <button className="hide-btn" onClick={() => {
            setSelectedLawyer(null);
            setShowDetails(false)}}>
            <FaTimes />
          </button>

          <div className="pending-left">
            <div className="card-title">
              <div className="title-icon">
                <FaCalendarAlt />
              </div>
              <h2>Appointment Details</h2>
            </div>

            <div className="detail-item">
              <div className="detail-left">
                <FaUserAlt />
                <span>Lawyer Name</span>
              </div>
              <strong>{selectedLawyer.lawyer.user_tb.name}</strong>
            </div>

            <div className="detail-item">
              <div className="detail-left">
                <FaCalendarAlt />
                <span>Requested Date</span>
              </div>
              <strong>{calDayAhead(selectedLawyer.slot.day_of_week, selectedLawyer.updated_at)}</strong>
            </div>

            <div className="detail-item">
              <div className="detail-left">
                <FaClock />
                <span>Requested Time</span>
              </div>
              <strong>{formatTime(selectedLawyer.slot.start_time)} - {formatTime(selectedLawyer.slot.end_time)}</strong>
            </div>

            <div className="detail-item">
              <div className="detail-left">
                <FaCommentDots />
                <span>Request Content</span>
              </div>
              <strong>{selectedLawyer.request_text !== ""?selectedLawyer.request_text:"No request from you"}</strong>
            </div>

            <div className="detail-item">
              <div className="detail-left">
                <FaCommentDots />
                <span>Response Content</span>
              </div>
              <strong>{selectedLawyer.response_text?selectedLawyer.response_text:"Currently, No message from this lawyers"}</strong>
            </div>

            {/* RESCHEDULE SECTION */}
            <div className="reschedule-box">
              <div className="res-left">
                <FaRedoAlt />
                <div>
                  <h3>Need to reschedule?</h3>
                  <p>You can reschedule or cancel your request before the lawyer responds.</p>
                </div>
              </div>

              <div className="d-flex justify-content-center">
              <Link to={`/reschedule/${selectedLawyer.id}`}>
                <button className="me-4 confirm">
                  <FaCalendarAlt />
                  Reschedule Appointment
                </button>
              </Link>

              <Link to="/reschedule"className="cancelLink">
                <button className="me-4 cancel" onClick={(e)=>handleCancel(e, selectedLawyer)}>
                  <FaTrashAlt />
                  Cancel Appointment
                </button>
              </Link>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}