import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllCities,
  getAllSpecializations,
  submitLawyerApplication,
} from "../../services/lawyerApi";
import "../../css/lawyer/register.css"

export default function LawyerRegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    address: "",
    yearExp: "",
    cardNumber: "",
    city: "",
    licenseNumber: "",
    documentImage: null,
    specializations: [],
  });

  const [cities, setCities] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadOptions() {
      try {
        setLoading(true);
        setError("");

        const [citiesRes, specsRes] = await Promise.all([
          getAllCities(),
          getAllSpecializations(),
        ]);

        setCities(Array.isArray(citiesRes) ? citiesRes : []);
        setSpecializations(Array.isArray(specsRes) ? specsRes : []);
      } catch (err) {
        setError(err.message || "Failed to load form data");
      } finally {
        setLoading(false);
      }
    }

    loadOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "documentImage") {
      setForm((prev) => ({
        ...prev,
        documentImage: files && files[0] ? files[0] : null,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecializationChange = (id) => {
    setForm((prev) => {
      const exists = prev.specializations.includes(id);

      return {
        ...prev,
        specializations: exists
          ? prev.specializations.filter((item) => item !== id)
          : [...prev.specializations, id],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const res = await submitLawyerApplication(form);

      setMessage(
        res?.success
          ? "Your lawyer application has been submitted and is waiting for admin approval."
          : "Submitted successfully."
      );

      setForm({
        address: "",
        yearExp: "",
        cardNumber: "",
        city: "",
        licenseNumber: "",
        documentImage: null,
        specializations: [],
      });
    } catch (err) {
      setError(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4 lawyerRegister">
      <div className="mx-auto" style={{ maxWidth: "900px" }}>
        <h1 className="mb-3">Join as a Lawyer</h1>
        <p className="text-muted mb-4 fs-3">
          Submit your lawyer profile for admin review. Your account will be upgraded after approval.
        </p>

        {message && <div className="alert alert-success fs-2">{message}</div>}
        {error && <div className="alert alert-danger fs-2">{error}</div>}

        {loading ? (
          <div className="card shadow-sm">
            <div className="card-body">Loading form...</div>
          </div>
        ) : (
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Years of Experience</label>
                  <input
                    type="number"
                    className="form-control"
                    name="yearExp"
                    value={form.yearExp}
                    onChange={handleChange}
                    min="0"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">City</label>
                  <select
                    className="form-select fs-2"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select city</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.cityName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">License Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="licenseNumber"
                    value={form.licenseNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Document Image</label>
                  <input
                    type="file"
                    className="form-control"
                    name="documentImage"
                    accept=".jpg,.jpeg,.png,.avif"
                    onChange={handleChange}
                  />
                  <div className="form-text">
                    Accepted: jpg, jpeg, png, avif
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label d-block mb-2">Specializations</label>
                  <div className="row">
                    {specializations.map((item) => (
                      <div className="col-md-6 mb-2" key={item.id}>
                        <div className="form-check">
                          <input
                            className="form-check-input fs-2"
                            type="checkbox"
                            id={`spec-${item.id}`}
                            checked={form.specializations.includes(item.id)}
                            onChange={() => handleSpecializationChange(item.id)}
                          />
                          <label className="form-check-label" htmlFor={`spec-${item.id}`}>
                            {item.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-secondary p-3"
                    onClick={() => navigate("/")}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}