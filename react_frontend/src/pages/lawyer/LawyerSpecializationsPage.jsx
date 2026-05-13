import { useEffect, useState } from "react";
import {
  getLawyerSpecializations,
  saveLawyerSpecializations,
} from "../../services/lawyerApi";

export default function LawyerSpecializationsPage() {
  const [available, setAvailable] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setError("");
        setMessage("");

        const res = await getLawyerSpecializations();

        setAvailable(res.data?.available_specializations || []);
        setSelectedIds(
          (res.data?.selected_specialization_ids || []).map((id) => Number(id))
        );
      } catch (err) {
        setError(err.message || "Failed to load specializations");
      }
    }

    loadData();
  }, []);

  const handleCheckbox = (id) => {
    const numericId = Number(id);

    setSelectedIds((prev) =>
      prev.includes(numericId)
        ? prev.filter((item) => item !== numericId)
        : [...prev, numericId]
    );
  };

  const handleSave = async () => {
    try {
      setError("");
      setMessage("");

      const res = await saveLawyerSpecializations(selectedIds);
      setMessage(res.message || "Saved successfully");
    } catch (err) {
      setError(err.message || "Failed to save specializations");
      setMessage("");
    }
  };

  return (
    <div>
      <h1 className="mb-4 fs-1">Lawyer Specializations Management</h1>

      {message && <div className="alert alert-success fs-3">{message}</div>}
      {error && <div className="alert alert-danger fs-3">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-3 fs-2">Select Your Specializations</h5>

          <div className="row">
            {available.map((item) => (
              <div className="col-md-6 mb-2" key={item.id}>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input fs-2"
                    id={`spec-${item.id}`}
                    checked={selectedIds.includes(Number(item.id))}
                    onChange={() => handleCheckbox(item.id)}
                  />
                  <label
                    className="form-check-label fs-2"
                    htmlFor={`spec-${item.id}`}
                  >
                    {item.name}
                  </label>
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-primary mt-3" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}