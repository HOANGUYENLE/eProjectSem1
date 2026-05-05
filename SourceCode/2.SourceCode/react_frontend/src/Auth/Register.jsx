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
    const [formData, setFormData] = useState({
        "name": "",
        "email": "",
        "phone": "",
        "password": "",
        "password_confirmation": "",
    });
    const [err, setErr] = useState({})
    async function handleRegister(e){
        e.preventDefault();
        try{
            const res = await axios.post("/api/register", formData, {timeout: 10000})
            let role = res.data.user.role.RoleName;    
            let name = res.data.user.name;
            let token = res.data.token;
            saveUserInfo(name, role, token);
            if(res.data){
                navigate("/");
            }
        }
        catch (errors) {
            if (errors.response) {
                const status = errors.response.status;
                const data = errors.response.data;

                if (status === 422) {
                alert(`Error ${status}: ${data.message}`);
                setErr(data.errors);
                console.log(data.errors);
                // Example: show first name error if exists
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
                // Handle network or timeout errors
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
          type="email"
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
      <button type="submit" className="btn btn-primary">Submit</button>
      <button type="button" className="btn btn-danger" onClick={()=>navigate("/")}>Cancel</button>
    </div>
  </form>
</div>

)}