import { useState } from "react"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import axios from "axios";
import "../css/signup.css"


export default function Register(){
    const navigate = useNavigate();
    const {user, setUser, saveUserInfo} = useContext(AuthContext);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        "name": "",
        "email": "",
        "phone": "",
        "password": "",
        "password_confirmation": "",
    });
    const [err, setErr] = useState({})
    function validateFormData(formData) {
      const errors = {};
      if (!formData.name.trim()) {
        errors.name = ["Name is required"];
      } else if (formData.name.length > 80) {
        errors.name = ["Name must be less than 10 characters"];
      }

      // Email
      if (!formData.email.trim()) {
        errors.email = ["Email is required"];
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          errors.email = ["Invalid email format"];
        } else if (formData.email.length > 80) {
          errors.email = ["Email must be less than 80 characters"];
        }
      }

      // Phone (digits only, 8–12 length)
      if (!formData.phone.trim()) {
        errors.phone = "Phone number is required";
      } else {
        const phoneRegex = /^[0-9]{8,12}$/;
        if (!phoneRegex.test(formData.phone)) {
          errors.phone = "Phone must be 8–12 digits";
        }
      }

      // Password
      if (!formData.password) {
        errors.password = "Password is required";
      } else if (formData.password.length > 255) {
        errors.password = "Password must be less than 255 characters";
      }

      // Password confirmation
      if (formData.password !== formData.password_confirmation) {
        errors.password_confirmation = "Passwords do not match";
      }

      return errors;
    }

    async function handleRegister(e){
        e.preventDefault();

        const validationErrors = validateFormData(formData);
          if (Object.keys(validationErrors).length > 0) {
          setErr(validationErrors);
          return;
        }

        try{
            const res = await axios.post("/api/register", formData, {timeout: 10000})
            let role = res.data.user.role.RoleName;    
            let name = res.data.user.name;
            let token = res.data.token;
            if(res.data){
              saveUserInfo(name, role, token);
              setSuccess(true);
              setTimeout(() => {
                  navigate("/"); // replace with your route
              }, 2000);
            }
        }
        catch (errors) {
            if (errors.response) {
                const status = errors.response.status;
                const data = errors.response.data;

                if (status === 422) {
                alert(`Error ${status}: ${data.message}`);
                setErr(data.errors);
                //console.log(data.errors);
                if (data.errors.name) {
                    console.log(data.errors.name[0]);
                }
                } else if (status === 403) {
                alert(`Error ${status}: This user already exists`);
                setErr(data.errors);
                } else {
                alert(`Error ${status}: ${data.message || "Unexpected error"}`);
                }
            } else {
                alert(`Network error: ${errors.message}`);
            }
        }
    };

    return (
    <div className="container w-50 mt-5 register">
  <h1 className="text-center mb-4">Register Form</h1>
  <form className="ms-auto me-auto" onSubmit={handleRegister} method="post">
    
    {/* Username */}
    <div className="mb-3">
      <div className="input-group">
        <span className="input-group-text"><i className="bi bi-person"></i></span>
        <input
          type="text"
          className="form-control"
          id="name"
          placeholder="Enter name"
          value={formData.name}
          autoComplete="on"
          onChange={(e)=>setFormData({...formData, name: e.target.value})}
        />
      </div>
      {err.name && <div className="alert alert-danger mt-2">{err.name[0]}</div>}
      
    </div>

    <div className="mb-3">
      <div className="input-group">
        <span className="input-group-text">@</span>
        <input
          type="text"
          className="form-control"
          id="email"
          placeholder="Enter your email address"
          value={formData.email}
          autoComplete="on"
          onChange={(e)=>setFormData({...formData, email: e.target.value})}
        />
      </div>
      {err.email && <div className="alert alert-danger mt-2">{err.email[0]}</div>}
    </div>

    {/* Phone */}
    <div className="mb-3">
      <div className="input-group">
        <span className="input-group-text"><i className="bi bi-telephone"></i></span>
        <input
          type="tel"
          className="form-control"
          id="phone"
          placeholder="Enter phone number"
          value={formData.phone}
          autoComplete="on"
          onChange={(e)=>setFormData({...formData, phone: e.target.value})}
        />
      </div>
      {err.phone && <div className="alert alert-danger mt-2">{err.phone}</div>}
    </div>

    {/* Password */}
    <div className="mb-3">
      <div className="input-group">
        <span className="input-group-text"><i className="bi bi-lock"></i></span>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e)=>setFormData({...formData, password: e.target.value})}
        />
      </div>
    </div>

    {/* Password confirmation */}
    <div className="mb-3">
      <div className="input-group">
        <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
        <input
          type="password"
          className="form-control"
          id="password_confirmation"
          placeholder="Password confirmation"
          value={formData.password_confirmation}
          onChange={(e)=>setFormData({...formData, password_confirmation: e.target.value})}
        />
      </div>
      {err.password && <div className="alert alert-danger mt-2">{err.password}</div>}
    </div>
        <hr />
    <div className="mt-2 mb-5">
        <a role="button" className="nav-link fs-2 text-end" onClick={()=>navigate("/login")}>Already have account? Let's sign in</a>
    </div>
    {/* Buttons */}
    <div className="d-flex justify-content-center gap-3 mt-4">
      <button type="submit" className="mySubmitBtn fs-2">Submit</button>
      <button type="button" className="myCancelBtn fs-2" onClick={()=>navigate("/")}>Cancel</button>
    </div>
  </form>
  {success && (
      <div className="success-popup">
      <div className="success-icon">✓</div>
      <h2>Register Successfully!</h2>
      <p>We will move back to homepage.</p>
      </div>
  )}
</div>

)}