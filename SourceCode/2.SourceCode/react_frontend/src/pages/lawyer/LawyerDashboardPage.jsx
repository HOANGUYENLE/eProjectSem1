import { useEffect, useState } from "react";
import { getLawyerDashboard } from "../../services/lawyerApi";

function CardBox({ title, value }) {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <p className="text-muted mb-2 fs-1">{title}</p>
          <h4 className="mb-0 fs-2">{value}</h4>
        </div>
      </div>
    </div>
  );
}

export default function LawyerDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setError("");
        const res = await getLawyerDashboard();
        setSummary(res.data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      }
    }

    loadData();
  }, []);

  return (
    <div>
      <h1 className="mb-4">Lawyer Dashboard</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {!error && !summary && <div>Loading...</div>}

      {summary && (
        <div className="row g-3">
          <CardBox
            title="Verification Status"
            value={summary.verification_status || "N/A"}
          />
          <CardBox
            title="Years of Experience"
            value={summary.years_of_experience ?? 0}
          />
          <CardBox
            title="Total Specializations"
            value={summary.total_specializations ?? 0}
          />
          <CardBox
            title="Total Available Slots"
            value={summary.total_available_slots ?? 0}
          />
          <CardBox
            title="Booked Slots"
            value={summary.booked_slots ?? 0}
          />
        </div>
      )}
    </div>
  );
}