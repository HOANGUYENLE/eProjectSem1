import { useEffect, useState } from "react";
import {
  createLawyerSlot,
  deleteLawyerSlot,
  getLawyerSlots,
  updateLawyerSlot,
} from "../../services/lawyerApi";

const defaultForm = {
  day_of_week: "Mon",
  start_time: "08:00",
  end_time: "10:00",
};

export default function LawyerSlotsPage() {
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadSlots = async () => {
    try {
      setError("");
      const res = await getLawyerSlots();
      setSlots(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load slots");
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingId) {
        const res = await updateLawyerSlot(editingId, form);
        setMessage(res.message || "Updated successfully");
      } else {
        const res = await createLawyerSlot(form);
        setMessage(res.message || "Created successfully");
      }

      setForm(defaultForm);
      setEditingId(null);
      await loadSlots();
    } catch (err) {
      setError(err.message || "Failed to save slot");
    }
  };

  const handleEdit = (slot) => {
    setEditingId(slot.id);
    setMessage("");
    setError("");
    setForm({
      day_of_week: slot.day_of_week,
      start_time: slot.start_time?.slice(0, 5) || "",
      end_time: slot.end_time?.slice(0, 5) || "",
    });
  };

  const handleDelete = async (id) => {
    try {
      setMessage("");
      setError("");
      const res = await deleteLawyerSlot(id);
      setMessage(res.message || "Deleted successfully");
      await loadSlots();
    } catch (err) {
      setError(err.message || "Failed to delete slot");
    }
  };

  return (
    <div>
      <h1 className="mb-4">Availability Slot Management</h1>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">{editingId ? "Edit Slot" : "Add Slot"}</h5>

          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Day of Week</label>
              <select
                className="form-select fs-2"
                name="day_of_week"
                value={form.day_of_week}
                onChange={handleChange}>

                <option value="Mon">Monday</option>
                <option value="Tue">Tuesday</option>
                <option value="Wed">Wednesday</option>
                <option value="Thu">Thurday</option>
                <option value="Fri">Friday</option>
                <option value="Sat">Saturday</option>
                <option value="Sun">Sunday</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                className="form-control"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">End Time</label>
              <input
                type="time"
                className="form-control"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-info fs-2 me-2">
                {editingId ? "Update Slot" : "Add Slot"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary fs-2"
                  onClick={() => {
                    setEditingId(null);
                    setForm(defaultForm);
                    setMessage("");
                    setError("");
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Existing Slots</h5>

          <div className="table-responsive">
            <table className="table table-bordered fs-2">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Day</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Booked</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {slots.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No slots found
                    </td>
                  </tr>
                ) : (
                  slots.map((slot) => (
                    <tr key={slot.id}>
                      <td>{slot.id}</td>
                      <td>{slot.day_of_week}</td>
                      <td>{slot.start_time?.slice(0, 5)}</td>
                      <td>{slot.end_time?.slice(0, 5)}</td>
                      <td>{slot.is_booked ? "Yes" : "No"}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-warning me-2 fs-2"
                          onClick={() => handleEdit(slot)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger fs-2"
                          onClick={() => handleDelete(slot.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}