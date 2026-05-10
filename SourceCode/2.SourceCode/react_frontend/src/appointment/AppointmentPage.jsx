
import {
  FaCalendarAlt,
  FaUserAlt,
  FaClock,
  FaCommentDots,
  FaRedoAlt,
  FaTimes,
  FaStar,
  FaBriefcase,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalculator,
  FaEdit
} from "react-icons/fa";
import "../css/appointment/AppointmentPage.css"
import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { useParams } from "react-router-dom";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { fetchDetailLawyerData, fetchRegisterAppointment } from "../apiComponent/apiService";
import { useState } from "react";
import { useEffect } from "react";
import RatingStar from "../layout/part/homepage/rating";

export default function AppointmentPage() {
  const {user, navigate, RatingCal, calDayAhead, formatTime} = useContext(AuthContext);
  const queryClient = useQueryClient();
  const {lawyerID} = useParams();



  
  const [success, setSuccess] = useState(false);
  useEffect(()=>{window.scrollTo(0, 0)},[])

  const queriesResults = useQueries({
    queries:[
      { queryKey: ["lawyer", lawyerID],
        queryFn: fetchDetailLawyerData,
        refetchInterval: 1000 * 60,
        enabled: !!lawyerID
      },
    ]
  });

  const Detail = queriesResults[0];
    useEffect(()=>{
      if (Detail?.data){
          console.log(Detail.data);
      }
  }, [Detail.data])

  const [form, setForm] = useState({
    'lawyer_id': lawyerID,
    'slot_id': "",
    'request_text': "",
  });

  const submitAppointment = async () => {
    if(!form.lawyer_id){
      alert("We dont know who is this lawyer you want to booking, please return to our list of lawyer and try booking process again")
      navigate("/ListOfLawyer");
      return false;
    }

    if(form.slot_id === ""){
      alert("Choose one of available time");
      return false
    }

    const res = fetchRegisterAppointment(form)
    if(res){
      setSuccess(true);
      setForm({
        'lawyer_id': "",
        'slot_id': "",
        'request_text': "",
      });
      setTimeout(() => {
        navigate("/"); // replace with your route
      }, 2000);
    }
    else{
      alert("booking failed");
    }
  };


  if (!Detail?.data) return <h1>Loading...</h1>;


  return (
    <>
      <div className="AppointmentContainer" id="appointment-page">
        {/* LEFT CARD */}
        <div className="card">
          <div className="profile-top">
            <img
              src={Detail.data.documentImage}
              alt="detail Image"
              className="avatar"
              style={{ width: "200px", height: "200px", objectFit: "cover",  objectPosition: "center top" }}
            />
            <div className="profile-info">
              <h1>{Detail.data.user_tb.name}</h1>
              <div className="info-item">
                <FaPhone />
                <span>{Detail.data.user_tb.name?Detail.data.user_tb.name:"This lawyer dont have phone number."}</span>
              </div>
              <div className="info-item">
                <FaEnvelope />
                <span>{Detail.data.user_tb.email}</span>
              </div>
              <div className="info-item">
                <FaMapMarkerAlt />
                <span>{Detail.data.address}</span>
              </div>
            </div>
          </div>
          <div className="line"></div>
          <div className="experience">
            <div className="icon-box">
              <FaCalculator />
            </div>
            <h2>{Detail.data.yearExp} year{`${Detail.data.yearExp > 1?"s":""}`} of experience</h2>
          </div>
          <div className="line"></div>
          <div className="practice">
            <div className="icon-box">
              <FaBriefcase />
            </div>
            <h2>Practice Areas:</h2>
          </div>
          <ul className="practice-list">
            {Detail.data.specialization.length > 1?
            (Detail.data.specialization.map((each)=>{
              return ( <li key={each.id}>{each.name}</li>)
            }))
            :(<li>This lawyer still not specified their specialization yet</li>)}
          </ul>
          <div className="line"></div>
          <div className="rating">
            <div className="rating-score">{RatingCal(Detail.data.reviews)}</div>
            <div className="stars">
              <RatingStar ratingStar={RatingCal(Detail.data.reviews)}/>
            </div>
            <div className="review">{Detail.data.reviews.length} reviews</div>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="card right">
          <h1>Make an appointment</h1>
          <div className="form-group">
            <label>Name Lawyer</label>
            <div className="input-box d-flex align-items-center position-relative">
              <input value={Detail.data.user_tb.name} readOnly />
              <FaUserAlt className="position-absolute top-50 end-0 translate-middle-y text-muted me-2 me-4"/>
            </div>
          </div>
          <div className="form-group">
            <label>Available Schedule</label>
            <div className="schedule-list">
              {Detail.data.availability.length > 0 ? 
              Detail.data.availability.map((each)=>{
                const timeStr = `${each.start_time} - ${each.end_time}`;
                
                if(each.is_booked){
                  return (
                    <div key={each.id} 
                    className={`schedule-card disabled`}>
                    <div className="schedule-left">
                      <div className="schedule-date">
                        <FaCalendarAlt />
                        {calDayAhead(each.day_of_week)}
                      </div>
                      <div className="schedule-time fs-4 text-danger">
                        <FaClock /> {formatTime(each.start_time)}-{formatTime(each.end_time)}: This schedule already booking
                      </div>

                    </div>
                  </div>
                  )
                }
                
                return (
                  <div key={each.id} 
                    className={`schedule-card ${ form.slot_id === each.id ? "active" : ""}`}
                    onClick={()=>setForm({...form, slot_id: each.id})}>
                    <div className="schedule-left">
                      <div className="schedule-date">
                        <FaCalendarAlt />
                        {calDayAhead(each.day_of_week)}
                      </div>
                      <div className="schedule-time">
                        <FaClock />
                        {formatTime(each.start_time)}-{formatTime(each.end_time)}
                      </div>
                    </div>
                  </div>
                  )
              }): <p className="fs-5 text-muted">This Lawyer still not public their own working time yet</p>}
            </div>
          </div>
          
          <div className="form-group">
            <label>Request Content</label>
            <div className="input-box textarea-box d-flex align-items-center position-relative">
              <textarea
                value={form.request_text}
                placeholder="Enter your request content"
                onChange={(e) =>
                  setForm({ ...form, request_text: e.target.value })
                }
              />
              <FaEdit className="position-absolute top-50 end-0 translate-middle-y text-muted me-2 me-4 fs-2"/>
            </div>
          </div>
          <div className="button-group">
            <button className="submit-btn" onClick={submitAppointment}>
              Submit
            </button>
            <button className="close-btn" onClick={() => window.location.reload()}>
              Close
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS POPUP */}
      {success && (
        <div className="success-popup">
          <div className="success-icon">✓</div>
          <h2>Appointment Submitted!</h2>
          <p>Your appointment has been created successfully.</p>
        </div>
      )}

      {/* FOOTER */}
      <div className="footer">© 2024 LawBooking. All rights reserved.</div>
    </>
  );
}
