import React from "react";
import "../../css/notification/announcement.css";


export default function Notifications({ notifications }) {
  return (
    <section className="notifications p-4 bg-light mt-4">
      <h3>🔔 Notifications Announcement</h3>
      <div className="list-group">
        {notifications.length === 0 ? (
          <p>No notifications available.</p>
        ) : (
          notifications.map(note => (
            <div key={note.id} className="list-group-item">
              <h5>{note.title}</h5>
              <small className="text-muted">
                {new Date(note.date).toLocaleDateString()} — {note.sender}
              </small>
              <p>{note.message}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

