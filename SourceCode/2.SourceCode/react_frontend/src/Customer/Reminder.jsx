import { useEffect } from "react";
 // make sure Bootstrap JS is imported
import { useState } from "react";

import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { useParams } from "react-router-dom";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { fetchTakeAppointment , fetchRegisterReschedule, 
  fetchReminder, fetchSystemNotification, fetchConfimRead} from "../apiComponent/apiService";

export default function Reminder() {
  const [showNotif, setShowNotif] = useState(false);
  const queryClient = useQueryClient();
  const {user, navigate, calDayAhead, formatTime, formatDate, RatingCal} = useContext(AuthContext);

  const queriesResults = useQueries({
        queries:[
          { 
            queryKey: ["Reminder", user.token],
            queryFn: fetchReminder,
            refetchInterval: 1000 * 30,
            enabled: !!user.token
          }
        ]
  });

  const ReminderData = queriesResults[0];

  useEffect(()=>{
    if(ReminderData.data){
      //console.log(ReminderData.data);
    }
  }, [ReminderData]);
  const HandleConfirmReminder = async (id) =>{
    const res = await fetchConfimRead(id);
    setShowNotif(false);
    if (res) {
      //console.log("Confirmed successfully");
      setShowNotif(true);
      queryClient.invalidateQueries(["Reminder", user.token]);
    }
  }

  return (
    <>
      <button className="nav-link btn position-relative" onClick={() => setShowNotif(!showNotif)}>
          <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 
          1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.
          447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
          </svg>

          {/* badge counter */}
          {(Array.isArray(ReminderData?.data) && ReminderData?.data.length > 0) &&
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {ReminderData?.data.length}
            </span>}
      </button>
      {showNotif && ReminderData?.data.length > 0 && (
          <div className="notification-dropdown">
            <section className="news p-4 bg-light mt-4">
              <h3>🔔 Notification</h3>
              <div className="list-group">
                {ReminderData.data.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="list-group-item border border-1 border-dark">
                    <h5>{reminder.title}</h5>
                    <small className="text-muted">
                      {formatDate(reminder.created_at)}{" "}
                      — From {reminder.user_tb.name}
                    </small>
                    <p className="mt-3">{reminder.content}</p>
                    {(reminder.title.includes("Cancel") || reminder.title.includes("Response") || reminder.title.includes("Rescheduled")) && <button className="btn btn-primary" onClick={()=>HandleConfirmReminder(reminder.id)}>Confirm</button>}
                  </div>
                ))}
              </div>
            </section>
          </div>


      )}
      
    </>
    
  );
}
