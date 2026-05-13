// src/pages/Reschedule.js

import { FaCalendarAlt, FaRedoAlt } from "react-icons/fa";
import "../css/appointment/reschedule.css"

import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { fetchSingleAppointment, fetchRegisterAppointment, fetchRegisterReschedule } from "../apiComponent/apiService";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Reschedule() {
    useEffect(()=>{window.scrollTo(0, 0)},[])
    const queryClient = useQueryClient();
    const {user, navigate, calDayAhead, formatTime, RatingCal} = useContext(AuthContext);
    const {appointmentID} = useParams();
    const [curSlot, setCurSlot] = useState();
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
      'appointment_id': appointmentID,
      'old_slot_id': null,
      'new_slot_id': null,
      'reason': ""
    })

    const queriesResults = useQueries({
        queries:[
          { queryKey: ["Appointment", user.name, appointmentID],
            queryFn: ()=>fetchSingleAppointment(appointmentID),
            refetchInterval: 1000 * 120,
            enabled: !!user.token
          },
        ]
    });
    
    const AppointmentData = queriesResults[0];

    useEffect(()=>{
      if(AppointmentData?.data){
        setCurSlot(AppointmentData.data.slot_id);
        setFormData({...formData, old_slot_id: AppointmentData.data.slot_id});
        //console.log(AppointmentData.data);
      }
    },[AppointmentData.data]);

    const handleChooseTimeSlot = (choosedSlot)=>{
      if(choosedSlot === curSlot){
        alert("Currently you have already choose this slot")
        return;
      }
      setCurSlot(choosedSlot);
      setFormData({...formData, new_slot_id: choosedSlot});
    }

    
    const handleSubmit = async ()=>{
      if(formData.new_slot_id === ""){
        alert("You have to choose 1 of available slot to reschedule")
        return;
      }

      const checkDate = new Date();
      if(checkDate.toLocaleDateString("en-US",{
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
      }) === calDayAhead(AppointmentData.data.lawyer.availability.day_of_week, 
        AppointmentData.data.updated_at)){
        const date = new Date(`1970-01-01T${AppointmentData.data.lawyer.availability.start_time}`);
        const start = new Date(checkDate);
        start.setHours(checkDate.getHours(),checkDate.getMinutes(),0,0);
        const end = new Date(checkDate);
        end.setHours(date.getHours(), date.getMinutes());
        if(((end - start) / (1000 * 60)) < 15){
          alert("Only least than 15 minutes until meeting, you cannot reschedule now but you can cancel it")
        }
      }

      const res = fetchRegisterReschedule("reschedule", formData);
      if(res){
        setSuccess(true);
         
        setTimeout(() => {
          navigate("/"); // replace with your route
        }, 2000);
      }
    }

    if (AppointmentData.isLoading) return <h1>Loading...</h1>;
    if (AppointmentData.isError) return (<h1>Can not load this page because server err</h1>)

    
    return (
      <div className="reschedule-page">
        <div className="page-header">
          <Link to="/myAppointment" className="back-link">← Back to Appointment Status</Link>
        </div>

        <div className="page-title">
          <div className="page-icon"><FaRedoAlt /></div>
          <div>
            <h1>Reschedule Appointment</h1>
            <p>Choose a new available schedule for your appointment.</p>
          </div>
        </div>

        <div className="reschedule-grid">
          {/* LEFT - Current Details */}
          <section className="current-details card">
            <div className="section-header"><h2>Current Appointment Details</h2></div>
            <div className="detail-item"><span>Lawyer name</span><strong>{AppointmentData.data.lawyer.user_tb.name}</strong></div>
            <div className="detail-item"><span>Current Date</span><strong>{calDayAhead(AppointmentData.data.slot.day_of_week, AppointmentData.data.updated_at)}</strong></div>
<div className="detail-item"><span>Current Time</span><strong>{formatTime(AppointmentData.data.slot.start_time)} - {formatTime(AppointmentData.data.slot.end_time)}</strong></div>
            <div className="detail-item detail-long"><span>Request Content</span><strong>{AppointmentData.data.request_text !== "" && AppointmentData.data.request_text? AppointmentData.data.request_text:"No request from you"}</strong></div>
            <div className="detail-item detail-long"><span>Response Content</span><strong>{AppointmentData.data.response_text?AppointmentData.data.response_text:"Currently, No message from this lawyers"}</strong></div>
          </section>

          {/* RIGHT - Available Slots */}
          <section className="select-new card">
            <div className="section-header"><FaCalendarAlt /><h2>Lawyer Available Schedule</h2></div>
            <div className="fixed-schedule">

              {AppointmentData.data.lawyer.availability.length === 0? 
              <p className="fs-5 text-muted">This Lawyer have deleted all their own working time aside from your request</p>:
              AppointmentData.data.lawyer.availability.map((each)=>{
                if(each.is_booked && each.id !== AppointmentData.data.slot_id){
                  return (
                    <div key={each.id + "available"} className="schedule-slot disabled">
                      <div className="slot-date">{calDayAhead(each.day_of_week, AppointmentData.data.updated_at)}</div>
                      <div className="slot-time">{formatTime(AppointmentData.data.slot.start_time)} - {formatTime(AppointmentData.data.slot.end_time)}</div>
                      <span className="slot-status-cancel">Booked</span>
                    </div>
                  )
                }

                else if (each.id === AppointmentData.data.slot_id){
                    return (
                      <div key={each.id + "available"} className="schedule-slot active">
                        <div className="slot-date">{calDayAhead(each.day_of_week, AppointmentData.data.updated_at)}</div>
                        <div className="slot-time">{formatTime(AppointmentData.data.slot.start_time)} - {formatTime(AppointmentData.data.slot.end_time)}</div>
                        <span className="slot-status">Your Booking</span>
                      </div>
                    )
                }

                return (
                  <div key={each.id + "available"} className={`schedule-slot ${each.id === curSlot
 ? "current" : ""}`} onClick={()=>handleChooseTimeSlot(each.id)}>
                    <div className="slot-date">{calDayAhead(each.day_of_week, AppointmentData.data.updated_at)}</div>
                    <div className="slot-time">{formatTime(AppointmentData.data.slot.start_time)} - {formatTime(AppointmentData.data.slot.end_time)}</div>
                    <span className="slot-status">Available</span>
                  </div>
                )
              })
             }

            </div>
            <div className="input-group">
              <label>Reason for Reschedule(optional): </label>
              <textarea placeholder="Write a message to the lawyer..." maxLength={250} 
              value={formData.reason} onChange={(e)=>{
                if(formData.reason.length < 250){
                  setFormData({...formData, reason: e.target.value});
                }
              }}/>
              <span className="char-count">{formData.reason.length}/250</span>
            </div>
            <div className="button-row">
              <Link to="/myAppointment" className="button secondary">Cancel</Link>
              <button className="button primary" onClick={()=>handleSubmit()}><FaCalendarAlt /> Confirm Reschedule</button>
            </div>
          </section>

          {/* INFO PANEL */}
          <aside className="info-panel card">
            <div className="section-header"><h2>Important Information</h2></div>
            <div className="info-item"><h3>Reschedule Policy</h3><p>You can reschedule your appointment before the lawyer confirms it.</p></div>
            <div className="info-item"><h3>Notifications</h3><p>The lawyer will receive your new appointment request instantly.</p></div>
            <div className="info-item"><h3>Secure & Private</h3><p>Your information and appointment details are protected securely.</p></div>
          </aside>
        </div>

        {success && (
        <div className="success-popup">
          <div className="success-icon">✓</div>
          <h2>Rescheduled Appointment Submitted!</h2>
          <p>Your appointment has been rescheduled successfully.</p>
        </div>
        )}

        {/* FOOTER */}
        <footer className="reschedule-footer">
          <div className="footer-help"><div className="footer-help-icon">🎧</div><div className="footer-help-text"><h3>Need Help?</h3><p className="fs-3">If you have any questions, contact our support team.</p></div></div>

          <div className="footer-contact"><span className="contact-icon">📧</span><span className="fs-3">support@lawbooking.com</span></div>
          <div className="footer-copyright">© 2024 LawBooking. All rights reserved.</div>
        </footer>
      </div>
    );
  }