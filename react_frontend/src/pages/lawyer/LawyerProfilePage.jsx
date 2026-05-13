import { useEffect, useState } from "react";
import { getLawyerProfile, updateLawyerProfile } from "../../services/lawyerApi";

export default function LawyerProfilePage() {
  const [form, setForm] = useState({
    address: "",
    yearExp: "",
    cardNumber: "",
    city: "",
    licenseNumber: "",
    documentImage: null,
  });

  const [profile, setProfile] = useState(null);
  const [cities, setCities] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setError("");
        const res = await getLawyerProfile();

        setProfile(res.data || null);
        setCities(res.meta?.cities || []);

        if (res.data) {
          setForm({
            address: res.data.address || "",
            yearExp: res.data.yearExp ?? "",
            cardNumber: res.data.cardNumber || "",
            city: res.data.city ?? "",
            licenseNumber: res.data.licenseNumber || "",
            documentImage: null,
          });
        }
      } catch (err) {
        setError(err.message || "Failed to load profile");
      }
    }

    loadProfile();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await updateLawyerProfile(form);
      setMessage(res.message || "Profile updated successfully");
      setProfile(res.data || null);

      if (res.data) {
        setForm((prev) => ({
          ...prev,
          address: res.data.address || "",
          yearExp: res.data.yearExp ?? "",
          cardNumber: res.data.cardNumber || "",
          city: res.data.city ?? "",
          licenseNumber: res.data.licenseNumber || "",
          documentImage: null,
        }));
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
    }
  };

  return (
    <div>
      <h1 className="mb-4">Lawyer Profile Management</h1>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          {profile?.user_tb && (
            <div className="mb-4">
              <p className="mb-1 fs-2"><strong>Name:</strong> {profile.user_tb.name}</p>
              <p className="mb-1 fs-2"><strong>Email:</strong> {profile.user_tb.email}</p>
              <p className="mb-1 fs-2"><strong>Phone:</strong> {profile.user_tb.phone}</p>
              <p className="mb-0 fs-2"><strong>Status:</strong> {profile.status}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                className="form-control"
                name="address"
                value={form.address}
                onChange={handleChange}
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
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Card Number</label>
              <input
                className="form-control"
                name="cardNumber"
                value={form.cardNumber}
                onChange={handleChange}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label">City</label>
              <select
                className="form-select fs-2"
                name="city"
                value={form.city}
                onChange={handleChange}
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
                className="form-control"
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Document Image</label>
              <input
                type="file"
                className="form-control"
                name="documentImage"
                onChange={handleChange}
              />
            </div>

            <button className="btn btn-primary" type="submit">
              Save Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}